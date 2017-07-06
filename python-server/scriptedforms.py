# Copyright (C) 2016 Simon Biggs
# This program is free software: you can redistribute it and/or
# modify it under the terms of the GNU Affero General Public
# License as published by the Free Software Foundation, either
# version 3 of the License, or (at your option) any later version.
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU
# Affero General Public License for more details.
# You should have received a copy of the GNU Affero General Public
# License along with this program. If not, see
# http://www.gnu.org/licenses/.

"""ScriptedForms"""

import sys
import os
import socket

import tornado.web

from kernel_gateway.gatewayapp import KernelGatewayApp

class Angular(tornado.web.RequestHandler):
    """Angular"""
    def get(self):
        """Angular"""

        self.render("index.html")


class ScriptedForms(KernelGatewayApp):

    dev_mode_string = os.getenv('DEVMODE')
    
    if dev_mode_string == "True":
        dev_mode = True
    else:
        dev_mode = False
        
    if dev_mode:
        static_directory = "./angular-frontend/dist"
    else:
        static_directory = os.path.join(sys._MEIPASS, 'angular')
    
    try:
        socket_test = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        socket_test.connect(('8.8.8.8', 1))
        ip = socket_test.getsockname()[0]
    except:
        ip = socket.gethostbyname(socket.gethostname())
    
    port = 5000

    def init_webapp(self):
        new_handlers = [
            ('/forms/assets/(.*)', tornado.web.StaticFileHandler, dict(
                path=os.path.join(self.static_directory, 'assets'))),
            (r'/forms/(styles.*\.bundle\.css)', tornado.web.StaticFileHandler, dict(
                path=self.static_directory)),
            (r'/forms/(inline.*\.bundle\.js)', tornado.web.StaticFileHandler, dict(
                path=self.static_directory)),
            (r'/forms/(vendor.*\.bundle\.js)', tornado.web.StaticFileHandler, dict(
                path=self.static_directory)),
            (r'/forms/(polyfills.*\.bundle\.js)', tornado.web.StaticFileHandler, dict(
                path=self.static_directory)),
            (r'/forms/(main.*\.bundle\.js)', tornado.web.StaticFileHandler, dict(
                path=self.static_directory)),
            ('/forms/.*', Angular),
            ('/?', tornado.web.RedirectHandler, {
                'url' : '/forms/',
                'permanent': False # want 302, not 301
            })
        ]
        original_handlers = self.personality.create_request_handlers()

        def new_create_request_handlers():
            return new_handlers + original_handlers

        self.personality.create_request_handlers = new_create_request_handlers

        super(ScriptedForms, self).init_webapp()

    def start(self):
        
        self.web_app.settings['debug'] = self.dev_mode
        self.web_app.settings['template_path'] = self.static_directory
        self.web_app.settings['static_path'] = self.static_directory
        
        super(ScriptedForms, self).start()

def main():
    ScriptedForms.launch_instance()

if __name__ == "__main__":
    main()
