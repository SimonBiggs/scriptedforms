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

import zipfile
import sys
import os
import socket
import webbrowser


import tornado.web
from traitlets import Unicode

from notebook.notebookapp import NotebookApp
from notebook.base.handlers import IPythonHandler

from notebook.auth import passwd


class Angular(IPythonHandler):
    """Angular"""
    def get(self):
        """Angular"""

        self.render("index.html")


class DownloadSource(IPythonHandler):
    """Download Source"""
    
    def get(self):
        """Download Source"""
        
        if os.name == 'nt':
            mode = 'rb'
        else:
            mode = 'r'
        
        temp_zip_filename = 'scriptedforms.zip'
                
        with zipfile.ZipFile(temp_zip_filename, 'w') as zf:
            for dirname, subdirs, files in os.walk('.'):
                for filename in files:
                    if os.path.basename(filename) != temp_zip_filename:
                        zf.write(os.path.join(dirname, filename))


        buf_size = 4096
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', 'attachment; filename=' + temp_zip_filename)
        
        with open(temp_zip_filename, mode) as f:
            while True:
                data = f.read(buf_size)
                if not data:
                    break
                self.write(data)
        
        os.remove(temp_zip_filename)
        self.finish()


class ScriptedForms(NotebookApp):
    default_url = Unicode('/forms/')
    
    try:
        s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
        s.connect(('8.8.8.8', 1))
        ip = s.getsockname()[0]
    except:
        ip = socket.gethostbyname(socket.gethostname())
    
    port = 5000

    def start(self):    
        dev_mode_string = os.getenv('DEVMODE')
        
        if dev_mode_string == "True":
            dev_mode = True
        else:
            dev_mode = False
            
        if dev_mode:
            static_directory = "./angular-frontend/dist"
        else:
            static_directory = os.path.join('app', 'angular')
       
        handlers = [
            ('/forms/assets/(.*)', tornado.web.StaticFileHandler, dict(
                path=os.path.join(static_directory, 'assets'))),
            (r'/forms/(styles.*\.bundle\.css)', tornado.web.StaticFileHandler, dict(
                path=static_directory)),
            (r'/forms/(inline.*\.bundle\.js)', tornado.web.StaticFileHandler, dict(
                path=static_directory)),
            (r'/forms/(vendor.*\.bundle\.js)', tornado.web.StaticFileHandler, dict(
                path=static_directory)),
            (r'/forms/(polyfills.*\.bundle\.js)', tornado.web.StaticFileHandler, dict(
                path=static_directory)),
            (r'/forms/(main.*\.bundle\.js)', tornado.web.StaticFileHandler, dict(
                path=static_directory)),
            ('/forms/downloadsource', DownloadSource),
            ('/forms/.*', Angular)
        ]
        
        self.web_app.add_handlers(".*$", handlers)
        self.web_app.settings['debug'] = dev_mode
        self.web_app.settings['template_path'] = static_directory
        self.web_app.settings['static_path'] = static_directory
        
        super(ScriptedForms, self).start()


def main():
    # password = passwd()
    
    ScriptedForms.launch_instance()

if __name__ == "__main__":
    main()
