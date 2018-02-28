# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.


import os
from os.path import join as pjoin
import sys
import argparse

from tornado.ioloop import IOLoop

from scriptedforms.scriptedforms import ScriptedForms

sys.path.append("..")
from dev_utilities.jupyterlab_extracts.process import Process  # noqa: E402

HERE = os.path.realpath(os.path.dirname(__file__))


class ProtractorTestApp(ScriptedForms):
    notebook_dir = pjoin(HERE, 'src')
    open_browser = False
    default_url = '/scriptedforms/landing-page.md'
    port = 8989
    log_level = 30

    def get_command(self):
        """Get the command to run."""
        cwd = HERE
        token = getattr(self, 'token', '')

        parser = argparse.ArgumentParser()
        parser.add_argument('--pattern', action='store')
        args, _ = parser.parse_known_args()
        pattern = args.pattern or '*.spec.js'

        env = os.environ.copy()
        env['JUPYTER_TOKEN'] = token
        env['PROTRACTOR_PATTERN'] = pattern
        protractor = os.path.abspath(
            pjoin(cwd, './node_modules/protractor/bin/protractor'))
        cmd = [protractor, 'build/protractor.conf.js'] + sys.argv[1:]
        return cmd, dict(env=env, cwd=cwd)

    def start(self):
        """Start the application.
        """
        IOLoop.current().add_callback(self._run_command)
        ScriptedForms.start(self)

    def _run_command(self):
        command, kwargs = self.get_command()
        kwargs.setdefault('logger', self.log)
        future = Process(command, **kwargs).wait_async()
        IOLoop.current().add_future(future, self._process_finished)

    def _process_finished(self, future):
        try:
            IOLoop.current().stop()
            sys.exit(future.result())
        except Exception as e:
            self.log.error(str(e))
            sys.exit(1)


def main():
    app = ProtractorTestApp.instance()
    app.initialize([])
    app.start()


if __name__ == '__main__':
    main()
