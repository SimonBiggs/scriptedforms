import os
import sys
from jupyterlab.tests.test_app import ProcessTestApp

HERE = os.path.realpath(os.path.dirname(__file__))

class KarmaTestApp(ProcessTestApp):
    def get_command(self):
        """Get the command to run."""
        env = os.environ.copy()
        karma = os.path.abspath(os.path.join(HERE, '../node_modules/karma/bin/karma'))
        cmd = [karma, 'start'] + sys.argv[1:]
        return cmd, dict(env=env, cwd=HERE)


def main():
    app = ProcessTestApp.instance()
    app.initialize([])
    app.start()


if __name__ == '__main__':
    main()