# coding: utf-8
"""JupyterLab command handler"""

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

import atexit
import logging
import os
import signal
import sys
import threading
import time
import weakref
from ipython_genutils.py3compat import which as _which

try:
    import subprocess32 as subprocess
except ImportError:
    import subprocess

from tornado import gen

try:
    import pty
except ImportError:
    pty = False

if sys.platform == 'win32':
    list2cmdline = subprocess.list2cmdline
else:
    def list2cmdline(cmd_list):
        import pipes
        return ' '.join(map(pipes.quote, cmd_list))


logging.basicConfig(format='%(message)s', level=logging.INFO)


def which(command, env=None):
    """Get the full path to a command.
    Parameters
    ----------
    command: str
        The command name or path.
    env: dict, optional
        The environment variables, defaults to `os.environ`.
    """
    env = env or os.environ
    path = env.get('PATH') or os.defpath
    command_with_path = _which(command, path=path)

    # Allow nodejs as an alias to node.
    if command == 'node' and not command_with_path:
        command = 'nodejs'
        command_with_path = _which('nodejs', path=path)

    if not command_with_path:
        if command in ['nodejs', 'node', 'npm']:
            msg = (
                'Please install nodejs 5+ and npm before continuing '
                'installation. nodejs may be installed using conda or '
                'directly from the nodejs website.')
            raise ValueError(msg)
        raise ValueError('The command was not found or was not ' +
                         'executable: %s.' % command)
    return command_with_path


class Process(object):
    """A wrapper for a child process.
    """
    _procs = weakref.WeakSet()
    _pool = None

    def __init__(self, cmd, logger=None, cwd=None, kill_event=None,
                 env=None, quiet=False):
        """Start a subprocess that can be run asynchronously.
        Parameters
        ----------
        cmd: list
            The command to run.
        logger: :class:`~logger.Logger`, optional
            The logger instance.
        cwd: string, optional
            The cwd of the process.
        env: dict, optional
            The environment for the process.
        kill_event: :class:`~threading.Event`, optional
            An event used to kill the process operation.
        """
        if not isinstance(cmd, (list, tuple)):
            raise ValueError('Command must be given as a list')

        if kill_event and kill_event.is_set():
            raise ValueError('Process aborted')

        self.logger = logger = logger or logging.getLogger('jupyterlab')
        self._last_line = ''
        if not quiet:
            self.logger.info('> ' + list2cmdline(cmd))
        self.cmd = cmd

        self.proc = self._create_process(cwd=cwd, env=env)
        self._kill_event = kill_event or threading.Event()

        Process._procs.add(self)

    def terminate(self):
        """Terminate the process and return the exit code.
        """
        proc = self.proc

        # Kill the process.
        if proc.poll() is None:
            os.kill(proc.pid, signal.SIGTERM)

        # Wait for the process to close.
        try:
            proc.wait()
        finally:
            Process._procs.remove(self)

        return proc.returncode

    def wait(self):
        """Wait for the process to finish.
        Returns
        -------
        The process exit code.
        """
        proc = self.proc
        kill_event = self._kill_event
        while proc.poll() is None:
            if kill_event.is_set():
                self.terminate()
                raise ValueError('Process was aborted')
            time.sleep(1.)
        return self.terminate()

    @gen.coroutine
    def wait_async(self):
        """Asynchronously wait for the process to finish.
        """
        proc = self.proc
        kill_event = self._kill_event
        while proc.poll() is None:
            if kill_event.is_set():
                self.terminate()
                raise ValueError('Process was aborted')
            yield gen.sleep(1.)

        raise gen.Return(self.terminate())

    def _create_process(self, **kwargs):
        """Create the process.
        """
        cmd = self.cmd
        kwargs.setdefault('stderr', subprocess.STDOUT)

        cmd[0] = which(cmd[0], kwargs.get('env'))

        if os.name == 'nt':
            kwargs['shell'] = True

        proc = subprocess.Popen(cmd, **kwargs)
        return proc

    @classmethod
    def _cleanup(cls):
        """Clean up the started subprocesses at exit.
        """
        for proc in list(cls._procs):
            proc.terminate()


# Register the cleanup handler.
atexit.register(Process._cleanup)
