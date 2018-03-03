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
import json
from threading import Thread

import requests
from tornado.queues import Queue
from tornado import gen

from notebook.base.handlers import APIHandler

from .code import send_code


WATCHDOG_SESSION_PATH = 'scriptedforms_watchdog_kernel'


def run_watchdog_start_api(port, token, queue=None):
    base_jupyter_api_url = 'localhost:{}/api'.format(port)
    jupyter_sessions_api = 'http://{}/sessions?token={}'.format(
        base_jupyter_api_url, token)

    sessions = requests.get(jupyter_sessions_api)
    paths = [item['path'] for item in sessions.json()]

    if WATCHDOG_SESSION_PATH in paths:
        return_results = (200, 'already started')
    else:
        payload = json.dumps({
            "path": WATCHDOG_SESSION_PATH,
            "kernel": {
                'name': 'python3'
            },
            'type': ''
        })

        requests.post(jupyter_sessions_api, data=payload)

        code = '\n'.join([
            'import os',
            'from watchdog.observers import Observer',
            'from watchdog.events import FileSystemEventHandler, FileModifiedEvent',  # noqa: E501
            '',
            '',
            'class MyHandler(FileSystemEventHandler):',
            '    def on_modified(self, event):',
            '        if type(event) == FileModifiedEvent:',
            '            print(os.path.abspath(event.src_path))',
            '',
            '',
            'event_handler = MyHandler()',
            'observer = Observer()',
            'observer.start()'
        ])

        send_code(port, token, WATCHDOG_SESSION_PATH, code)
        return_results = (200, 'successfully started')

    if queue is not None:
        queue.put(return_results)

    return return_results


class WatchdogStartApiHandler(APIHandler):
    def initialize(self, port):
        self.port = port
        self.queue = Queue(maxsize=1)

    @gen.coroutine
    def post(self, watch_path):
        thread = Thread(
            target=run_watchdog_start_api,
            args=(self.port, self.token, watch_path),
            kwargs={'queue': self.queue})
        thread.start()

        result = yield self.queue.get()
        self.set_status(result[0])
        self.finish(json.dumps(result[1]))


def run_watchdog_add_api(port, token, watch_path, queue=None):
    directory = os.path.dirname(watch_path)
    code = 'observer.schedule(event_handler, path={})'.format(directory)

    send_code_results = send_code(port, token, WATCHDOG_SESSION_PATH, code)
    return_results = (200, send_code_results)

    if queue is not None:
        queue.put(return_results)

    return return_results


class WatchdogAddApiHandler(APIHandler):
    def initialize(self, port):
        self.port = port
        self.queue = Queue(maxsize=1)

    @gen.coroutine
    def post(self, watch_path):
        thread = Thread(
            target=run_watchdog_add_api,
            args=(self.port, self.token, watch_path),
            kwargs={'queue': self.queue})
        thread.start()

        result = yield self.queue.get()
        self.set_status(result[0])
        self.finish(json.dumps(result[1]))
