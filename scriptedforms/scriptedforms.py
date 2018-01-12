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
# from glob import glob

from jinja2 import FileSystemLoader
from traitlets import Unicode

from notebook.notebookapp import NotebookApp
from notebook.base.handlers import IPythonHandler, FileFindHandler

from .directory_init import (
    initialise_scriptedforms_directory, get_scriptedforms_directory)

HERE = os.path.dirname(__file__)
LOADER = FileSystemLoader(HERE)

class ScriptedFormsHandler(IPythonHandler):
    """Handle requests between the main app page and notebook server."""

    def get(self, form_file):
        """Get the main page for the application's interface."""
        form_file = os.path.relpath(form_file)
        file_extension = os.path.splitext(form_file)[1].lower()

        if file_extension == '.md':
            render_type = 'template'

        if file_extension == '.json':
            render_type = 'results'

        return self.write(self.render_template("index.html",
            static=self.static_url, base_url=self.base_url,
            token=self.settings['token'], form_file=form_file, 
            render_type=render_type))

    def get_template(self, name):
        return LOADER.load(self.settings['jinja2_env'], name)


class ScriptedForms(NotebookApp):
    """A notebook app that runs the example."""

    name = 'ScriptedForms'
    description = """
        Scripted Forms

        Open a scriptedform based on a template file.
    """

    def start(self):
        handlers = [
            (r'/scriptedforms/(.*\.md)', ScriptedFormsHandler),
            (r'/scriptedforms/(.*\.json)', ScriptedFormsHandler),
            (r"/scriptedforms/(.*)", FileFindHandler,
                {'path': os.path.join(HERE, 'build')}),
        ]
        self.web_app.add_handlers(".*$", handlers)
        super(ScriptedForms, self).start()


def main():

    parser = argparse.ArgumentParser(description='ScriptedForms.')
    parser.add_argument(
        '--init', dest='init', help='Reinitialise ScriptedForms directory', 
        action='store_true')

    args = parser.parse_args()
    if args.init:
        scriptedforms_directory = initialise_scriptedforms_directory()
    else:
        scriptedforms_directory = get_scriptedforms_directory()
        
    try:
        os.chdir(scriptedforms_directory)
    except FileNotFoundError:
        scriptedforms_directory = initialise_scriptedforms_directory()
        os.chdir(scriptedforms_directory)

    sys.argv = [sys.argv[0]]
    ScriptedForms.launch_instance(
        default_url='/scriptedforms/landing-page.form.md')

if __name__ == '__main__':
    main()
