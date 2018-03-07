# Scripted Forms -- Making GUIs easy for everyone on your team.
# Copyright (C) 2017 Simon Biggs

# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as published
# by the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version (the "AGPL-3.0+").

# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
# GNU Affero General Public License and the additional terms for more
# details.

# You should have received a copy of the GNU Affero General Public License
# along with this program. If not, see <http://www.gnu.org/licenses/>.

# ADDITIONAL TERMS are also included as allowed by Section 7 of the GNU
# Affrero General Public License. These aditional terms are Sections 1, 5,
# 6, 7, 8, and 9 from the Apache License, Version 2.0 (the "Apache-2.0")
# where all references to the definition "License" are instead defined to
# mean the AGPL-3.0+.

# You should have received a copy of the Apache-2.0 along with this
# program. If not, see <http://www.apache.org/licenses/LICENSE-2.0>.


import os
import re
from glob import glob

from notebook.base.handlers import IPythonHandler, FileFindHandler
from notebook.utils import url_path_join as ujoin

from ._utilities import HERE


def get_scriptedforms_handlers(base_url):
    lib_dir = os.path.join(HERE, 'lib')
    lib_files = glob(os.path.join(lib_dir, '*'))
    rel_paths = [os.path.relpath(item, lib_dir) for item in lib_files]

    lib_escaped = [re.escape(item) for item in rel_paths]
    lib_strings = '|'.join(lib_escaped)

    static_handler_regex = "/scriptedforms/({})".format(lib_strings)

    scriptedforms_handlers = [
        (
            ujoin(base_url, r'/scriptedforms/.*\.md'), 
            ScriptedFormsHandler
        ),
        (
            ujoin(base_url, static_handler_regex), 
            FileFindHandler,
            {'path': lib_dir}
        ),
        (
            ujoin(base_url, r"/scriptedforms/(.*)"), 
            FileFindHandler,
            {'path': '.'}
        ),
    ]

    return scriptedforms_handlers


class ScriptedFormsHandler(IPythonHandler):
    def get(self):
        with open(os.path.join(HERE, 'index.html'), 'r') as f:
            template = f.read()

        return self.write(template)
