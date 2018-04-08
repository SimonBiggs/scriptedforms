# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.


import os
import re
from glob import glob

from notebook.base.handlers import IPythonHandler, FileFindHandler
from notebook.utils import url_path_join as ujoin

from jinja2 import FileSystemLoader

from ._utilities import HERE
LOADER = FileSystemLoader(HERE)


def get_scriptedforms_handlers(base_url):
    lib_dir = os.path.join(HERE, 'lib')
    lib_files = glob(os.path.join(lib_dir, '*'))
    rel_paths = [os.path.relpath(item, lib_dir) for item in lib_files]

    lib_escaped = [re.escape(item) for item in rel_paths]
    lib_strings = '|'.join(lib_escaped)

    static_handler_regex = "/scriptedforms/static/({})".format(lib_strings)

    scriptedforms_handlers = [
        (
            ujoin(base_url, r'/scriptedforms/use/.*\.md'),
            ScriptedFormsHandler,
            {'application_to_run': 'use'}
        ),
        (
            ujoin(base_url, static_handler_regex),
            FileFindHandler,
            {'path': lib_dir}
        ),
        (
            ujoin(base_url, r'/scriptedforms/docs'),
            ScriptedFormsHandler,
            {'application_to_run': 'docs'}
        ),
        (
            ujoin(base_url, r'/scriptedforms/docs/.*'),
            ScriptedFormsHandler,
            {'application_to_run': 'docs'}
        )
    ]

    return scriptedforms_handlers


class ScriptedFormsHandler(IPythonHandler):
    def initialize(self, application_to_run):
        self.application_to_run = application_to_run

    def get(self):
        return self.write(self.render_template(
            "index.html",
            base_url=self.base_url,
            application_to_run=self.application_to_run))

    def get_template(self, name):
        return LOADER.load(self.settings['jinja2_env'], name)
