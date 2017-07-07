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
import tkinter as tk

import tornado.web
from traitlets import Unicode

from notebook.notebookapp import NotebookApp
from notebook.base.handlers import IPythonHandler

from notebook.auth import passwd


dev_mode_string = os.getenv('DEVMODE')

if dev_mode_string == "True":
    dev_mode = True
else:
    dev_mode = False
    
if dev_mode:
    static_directory = "./angular-frontend/dist"
else:
    static_directory = os.path.join('app', 'angular')


class Angular(IPythonHandler):
    """Angular"""
    def get(self):
        """Angular"""

        with open(os.path.join(static_directory, 'index.html'), 'r') as f:
            self.write(f.read())


class DownloadSource(IPythonHandler):
    """Download Source"""
    
    def get(self):
        """Download Source"""
        
        temp_zip_filename = 'scriptedforms.zip'
                
        with zipfile.ZipFile(temp_zip_filename, 'w') as zf:
            for dirname, subdirs, files in os.walk('.'):
                for filename in files:
                    if os.path.basename(filename) != temp_zip_filename:
                        zf.write(os.path.join(dirname, filename))


        buf_size = 4096
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', 'attachment; filename=' + temp_zip_filename)
        
        if os.name == 'nt':
            mode = 'rb'
        else:
            mode = 'r'

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
        
        super(ScriptedForms, self).start()


def define_password(password_filename):
    password_container = []
    
    root = tk.Tk()

    root.wm_title("Define Password")

    l1 = tk.Label(root, text="Please define a password:")
    l2 = tk.Label(
        root, text="A hash of this password will be saved in {}".format(password_filename))
    l3 = tk.Label(
        root, text="Delete {} to change password".format(password_filename))

    e = tk.Entry(root, show="*", width=30, justify='center')

    def send_password(event=None):
        password_container.append(e.get())
        root.destroy()

    b = tk.Button(root, text="OK", command=send_password)
    root.bind('<Return>', send_password)

    l1.pack(pady=10)
    e.pack()
    b.pack(pady=15)
    l2.pack(padx=20)
    l3.pack(pady=10)
    e.focus()
    
    root.mainloop()
    
    return passwd(password_container[0])


def main():
    password_filename = 'password.txt'

    if os.path.exists(password_filename):
        with open(password_filename, 'r') as f:
            password = f.read()
    else:
        password = define_password(password_filename)
        with open(password_filename, 'w') as f:
            f.write(password)
    
    ScriptedForms.launch_instance(password=password)

if __name__ == "__main__":
    main()
