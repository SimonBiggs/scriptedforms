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

import json
from threading import Thread
import ast

from tornado.queues import Queue
from tornado import gen

from notebook.base.handlers import APIHandler

from .code import send_code


def run_variable_api(port, token, filename, queue=None):
    code = '_scriptedforms_variable_handler.variables_json'
    send_code_results = send_code(port, token, filename, code)
    variables_dict = json.loads(
        ast.literal_eval(send_code_results[0]['text/plain']))

    return_results = (200, variables_dict)

    if queue is not None:
        queue.put(return_results)

    return return_results


class VariablesApiHandler(APIHandler):
    def initialize(self, port):
        self.port = port
        self.queue = Queue(maxsize=1)

    @gen.coroutine
    def get(self, filename):
        thread = Thread(
            target=run_variable_api,
            args=(self.port, self.token, filename),
            kwargs={'queue': self.queue})
        thread.start()

        result = yield self.queue.get()
        self.set_status(result[0])
        self.finish(json.dumps(result[1]))
