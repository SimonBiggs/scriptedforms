# Scripted Forms
# Copyright (C) 2018 Simon Biggs

# This software is licensed under both the Apache License, Version 2.0
# (the "Apache-2.0") and the
# GNU Affrero General Public License as published by the Free Software
# Foundation, either version 3 of the License, or (at your option) any later
# version (the "AGPL-3.0+").

# You may not use this software except in compliance with both the Apache-2.0 and
# the AGPL-3.0+.

# Copies of these licenses can be found at:

# * AGPL-3.0+ -- https://www.gnu.org/licenses/agpl-3.0.txt
# * Apache-2.0 -- https://www.apache.org/licenses/LICENSE-2.0.html

# Unless required by applicable law or agreed to in writing, software
# distributed under the Apache-2.0 and the AGPL-3.0+ is distributed on an **"AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND**, either express or implied. See
# the Apache-2.0 and the AGPL-3.0+ for the specific language governing permissions and
# limitations under the Apache-2.0 and the AGPL-3.0+.


import sys
import os
import argparse
from glob import glob

from notebook.notebookapp import NotebookApp
from notebook.base.handlers import IPythonHandler, FileFindHandler

HERE = os.path.dirname(__file__)



class _ScriptedFormsHandler(IPythonHandler):
    def get(self):
        with open(os.path.join(HERE, 'index.html'), 'r') as f:
            template = f.read()

        return self.write(template)


class ScriptedForms(NotebookApp):
    """ScriptedForms."""

    name = 'ScriptedForms'
    description = """
        Scripted Forms

        Open a scriptedform based on a template file.
    """

    def start(self):
        handlers = [
            (r'/scriptedforms/.*\.md', _ScriptedFormsHandler),
            (
                r"/scriptedforms/(.*)", FileFindHandler,
                {'path': os.path.join(HERE, 'build')}
            )
        ]
        self.web_app.add_handlers(".*$", handlers)
        super(ScriptedForms, self).start()


def load(filepath, args=None):

    absolute_path = os.path.abspath(filepath)
    if not os.path.exists(absolute_path):
        raise ValueError('file does not exist')

    directory, filename = os.path.split(absolute_path)

    os.chdir(directory)

    kwargs = {}
    if args:
        if args.no_browser is not None:
            kwargs['open_browser'] = False
        if args.token is not None:
            kwargs['token'] = args.token
        if args.password is not None:
            kwargs['password'] = args.password
        if args.port is not None:
            kwargs['port'] = args.port
        if args.disable_check_xsrf is not None:
            kwargs['disable_check_xsrf'] = True

    # workaround for Notebook app using sys.argv
    sys.argv = [sys.argv[0]]
    ScriptedForms.launch_instance(
        default_url='/scriptedforms/{}'.format(filename), **kwargs)


def main():
    parser = argparse.ArgumentParser(description='ScriptedForms.')
    parser.add_argument(
        'filepath', help='The file path of the form to open.')
    parser.add_argument(
        '--no-browser', dest='no_browser', action='store_true',
        help='Make browser not open.')
    parser.add_argument(
        '--token', dest='token',
        help='Jupyter token.')
    parser.add_argument(
        '--password', dest='password',
        help='Jupyter password.')
    parser.add_argument(
        '--port', dest='port', type=int,
        help='Jupyter port.')
    parser.add_argument(
        '--disable_check_xsrf', dest='disable_check_xsrf', action='store_true',
        help='Disable Jupyter xsrf check')

    
       
    args = parser.parse_args()
    print(args)
    
    load(args.filepath, args)


if __name__ == '__main__':
    main()
