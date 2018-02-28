# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.


import os
from os.path import join as pjoin
import sys

import json

from jupyterlab.tests.test_app import ProcessTestApp

HERE = os.path.realpath(os.path.dirname(__file__))


class KarmaTestApp(ProcessTestApp):
    def get_command(self):
        """Get the command to run."""
        cwd = HERE

        terminalsAvailable = self.web_app.settings['terminals_available']
        token = getattr(self, 'token', '')
        config = dict(
            baseUrl=self.connection_url, token=token,
            terminalsAvailable=str(terminalsAvailable),
            foo='bar')

        print('\n\nNotebook config:')
        print(json.dumps(config))

        karma_inject_file = pjoin(cwd, 'build', 'injector.js')
        if not os.path.exists(pjoin(cwd, 'build')):
            os.makedirs(pjoin(cwd, 'build'))

        with open(karma_inject_file, 'w') as fid:
            fid.write("""
            var node = document.createElement('script');
            node.id = 'jupyter-config-data';
            node.type = 'application/json';
            node.textContent = '%s';
            document.body.appendChild(node);
            """ % json.dumps(config))

        env = os.environ.copy()
        env['KARMA_INJECT_FILE'] = karma_inject_file.encode('utf-8')
        karma = os.path.abspath(os.path.join(
            cwd, './node_modules/karma/bin/karma'))
        cmd = [karma, 'start'] + sys.argv[1:]
        return cmd, dict(env=env, cwd=cwd)


def main():
    app = KarmaTestApp.instance()
    app.initialize([])
    app.start()


if __name__ == '__main__':
    main()
