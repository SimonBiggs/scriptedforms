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
import datetime
import uuid
from threading import Thread

import requests
from websocket import create_connection
from tornado.queues import Queue
from tornado import gen

import numpy as np

from notebook.base.handlers import APIHandler


def send_code(port, token, filename, code, queue=None):
    base_jupyter_api_url = 'localhost:{}/api'.format(port)
    get_sessions = 'http://{}/sessions?token={}'.format(
        base_jupyter_api_url, token)
    sessions = requests.get(get_sessions)

    ids = np.array([item['id'] for item in sessions.json()])
    paths = np.array([item['path'] for item in sessions.json()])

    session_ids = ids[paths == filename]
    assert len(session_ids) == 1

    session_id = session_ids[0]

    get_session_model = 'http://{}/sessions/{}?token={}'.format(
        base_jupyter_api_url, session_id, token)
    session_model = requests.get(get_session_model)
    kernel_id = session_model.json()['kernel']['id']

    websocket_url = 'ws://{}/kernels/{}/channels?token={}'.format(
        base_jupyter_api_url, kernel_id, token)

    header = {
        'msg_id': str(uuid.uuid1()),
        'username': '',
        'session': session_id,
        'date': datetime.datetime.now().replace(microsecond=0).isoformat(),
        'msg_type': 'execute_request',
        'version': '5.2'
    }

    content = {
        'code': code,
        'silent': False,
        'store_history': True,
        'user_expressions': {},
        'allow_stdin': True,
        'stop_on_error': False,
    }

    payload = {
        'header': header,
        'parent_header': {},
        'metadata': {},
        'channel': 'shell',
        'content': content,
        'buffers': []
    }

    ws = create_connection(websocket_url)
    ws.send(json.dumps(payload))

    responses = []
    results = []

    try:
        while True:
            recieved = json.loads(ws.recv())
            responses.append(recieved)
            if recieved['channel'] == 'iopub':
                if recieved['msg_type'] == 'status':
                    if recieved['content']['execution_state'] == 'idle':
                        break
                elif 'data' in recieved['content'].keys():
                    results.append(recieved['content']['data'])
    finally:
        ws.close()

    if queue is not None:
        queue.put(results)

    return results


class CodeApiHandler(APIHandler):
    def initialize(self, port):
        self.port = port
        self.queue = Queue(maxsize=1)

    @gen.coroutine
    def post(self, filename):
        code = self.request.body.decode("utf-8")
        thread = Thread(
            target=send_code,
            args=(self.port, self.token, filename, code),
            kwargs={'queue': self.queue})
        thread.start()

        result = yield self.queue.get()
        self.set_status(201)
        self.finish(json.dumps(result))
