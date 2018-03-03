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

from tornado.queues import Queue
from tornado import gen

import markdown
import lxml.html

from notebook.base.handlers import APIHandler

from .code import send_code


def run_section_api(port, token, directory, filename, api_name, queue=None):
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r') as markdown_file:
        markdown_contents = markdown_file.read()

    html = markdown.markdown(
        markdown_contents, extensions=['markdown.extensions.fenced_code'])
    html = html.replace('<p>', '').replace('</p>', '')
    tree = lxml.html.fromstring(html)

    sections = tree.cssselect(
        'section-start,section-live,section-button,section-output')

    matching_section = list(filter(lambda section: (
        'api', api_name) in section.items(), sections))
    assert len(matching_section) == 1

    section = matching_section[0]
    item_labels = [item[0] for item in section.items()]

    try:
        index = item_labels.index('conditional')
        conditional = section.items()[index][1]
    except ValueError:
        conditional = None

    if conditional is not None:
        conditional_code_results = send_code(
            port, token, filename, conditional)
        assert len(conditional_code_results) == 1
        conditional_code_result = conditional_code_results[0]
        if conditional_code_result['text/plain'] == 'True':
            condition_result = True
        elif conditional_code_result['text/plain'] == 'False':
            condition_result = False
        else:
            raise AssertionError('Contional result should be True or False')
    else:
        condition_result = True

    if condition_result:
        python_code = section.cssselect('code.python')
        python_code_content = [block.text for block in python_code]

        results = []
        for code in python_code_content:
            results.append(send_code(port, token, filename, code))

        return_results = (201, results)
    else:
        return_results = (400, '')

    if queue is not None:
        queue.put(return_results)

    return return_results


class SectionApiHandler(APIHandler):
    def initialize(self, port, directory):
        self.port = port
        self.queue = Queue(maxsize=1)
        self.directory = directory

    @gen.coroutine
    def post(self, filename):
        api_name = self.request.body.decode("utf-8")
        thread = Thread(
            target=run_section_api,
            args=(self.port, self.token, self.directory, filename, api_name),
            kwargs={'queue': self.queue})
        thread.start()

        result = yield self.queue.get()
        self.set_status(result[0])
        self.finish(json.dumps(result[1]))
