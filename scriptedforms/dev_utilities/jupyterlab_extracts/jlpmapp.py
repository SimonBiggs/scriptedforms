# coding: utf-8
"""A Jupyter-aware wrapper for the yarn package manager"""

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.
import os
from ipython_genutils.py3compat import which as _which

HERE = os.path.dirname(os.path.abspath(__file__))


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
