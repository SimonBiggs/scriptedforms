# Scripted Forms -- Making GUIs easy for everyone on your team.
# Copyright (C) 2017 Simon Biggs

# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at

#     http://www.apache.org/licenses/LICENSE-2.0

# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


import sys
import os
import argparse

from notebook.notebookapp import NotebookApp

from ._scriptedforms_handlers import get_scriptedforms_handlers


def _jupyter_server_extension_paths():
    return [{
        "module": "scriptedforms"
    }]


def load_jupyter_server_extension(notebook_app):
    web_app = notebook_app.web_app
    base_url = web_app.settings['base_url']
    handlers = get_scriptedforms_handlers(base_url)

    web_app.add_handlers(".*$", handlers)


class ScriptedForms(NotebookApp):
    """ScriptedForms."""

    name = 'ScriptedForms'
    description = """
        Scripted Forms

        Open a scriptedform based on a template file.
    """

    def start(self):
        load_jupyter_server_extension(self)
        super(ScriptedForms, self).start()


def load(filepath):
    absolute_path = os.path.abspath(filepath)
    if not os.path.exists(absolute_path):
        raise ValueError('File does not exist: {}'.format(absolute_path))

    directory, filename = os.path.split(absolute_path)

    # workaround for Notebook app using sys.argv
    sys.argv = [sys.argv[0]]
    ScriptedForms.launch_instance(
        notebook_dir=directory,
        default_url='/scriptedforms/use/{}'.format(filename))


def open_docs():
    sys.argv = [sys.argv[0]]
    ScriptedForms.launch_instance(
        default_url='/scriptedforms/docs')


def main():
    parser = argparse.ArgumentParser(description='ScriptedForms.')
    parser.add_argument(
        'filepath', help='The file path of the form to open.', nargs='?',
        default=None)

    args = parser.parse_args()
    if args.filepath:
        load(args.filepath)
    else:
        open_docs()


if __name__ == '__main__':
    main()
