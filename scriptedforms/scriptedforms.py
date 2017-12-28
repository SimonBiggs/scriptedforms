LICENCE_HEADER = """
  --------------
  Scripted Forms
  --------------
  Copyright (C) 2017 Simon Biggs

  Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
  GNU Affrero General Public License as published by the Free Software 
  Foundation, either version 3 of the License, or (at your option) any later 
  version (the "AGPL-3.0+").

  You may not use this script except in compliance with both the Apache-2.0 AND 
  the AGPL-3.0+ in combination (the "Combined Licenses").

  You may obtain a copy of the AGPL-3.0+ at
      <https://www.gnu.org/licenses/agpl-3.0.txt>

  You may obtain a copy of the Apache-2.0 at
      <https://www.apache.org/licenses/LICENSE-2.0.html>

  Unless required by applicable law or agreed to in writing, software
  distributed under the Combined Licenses is distributed on an "AS IS" BASIS, 
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See 
  the Combined Licenses for the specific language governing permissions and 
  limitations under the Combined Licenses.
  
"""

import sys
import os
import argparse
# from glob import glob

from jinja2 import FileSystemLoader
from traitlets import Unicode

from notebook.notebookapp import NotebookApp
from notebook.base.handlers import IPythonHandler, FileFindHandler


HERE = os.path.dirname(__file__)
LOADER = FileSystemLoader(HERE)


class ScriptedFormsHandler(IPythonHandler):
    """Handle requests between the main app page and notebook server."""

    def get(self, form_file):
        """Get the main page for the application's interface."""
        return self.write(self.render_template("index.html",
            static=self.static_url, base_url=self.base_url,
            token=self.settings['token'], form_file=form_file))

    def get_template(self, name):
        return LOADER.load(self.settings['jinja2_env'], name)


class ScriptedForms(NotebookApp):
    """A notebook app that runs the example."""

    name = 'ScriptedForms'
    description = """
        Scripted Forms

        Open a scriptedform based on a template file.
    """

    default_url = '/scriptedforms/untitled.form.md'

    def start(self):
        print(self.default_url)
        handlers = [
            (r'/scriptedforms/(.*\.form\.md)', ScriptedFormsHandler),
            (r"/scriptedforms/(.*)", FileFindHandler,
                {'path': os.path.join(HERE, 'build')}),
        ]
        self.web_app.add_handlers(".*$", handlers)
        super(ScriptedForms, self).start()


def main():
    print(LICENCE_HEADER)

    parser = argparse.ArgumentParser(
        description='Open a scriptedform based on a template file.')
    parser.add_argument(
        'filename', help='The form template filename to open')
    args = parser.parse_args()

    sys.argv = [sys.argv[0]]

    if not(os.path.exists(args.filename)):
        raise Exception('File does not exist')

    if (args.filename[-8::] != '.form.md'):
        raise Exception('Form template must have .form.md extension')

    ScriptedForms.launch_instance(
        default_url='/scriptedforms/{}'.format(args.filename))

if __name__ == '__main__':
    main()