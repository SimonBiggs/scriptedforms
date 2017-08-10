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

import logging
import zipfile
import os
import socket
import tkinter as tk

import tornado.web
import tornado.autoreload
from tornado.log import enable_pretty_logging

from traitlets import Unicode
from notebook.base.handlers import IPythonHandler
from notebook.auth import passwd


dev_mode_string = os.getenv('DEVMODE')

if dev_mode_string == "True":
    dev_mode = True
elif dev_mode_string is None:
    dev_mode = False
else:
    raise Exception("Invalid devmode string")

if dev_mode:
    from kernel_gateway.gatewayapp import KernelGatewayApp as NotebookApp
else:
    from notebook.notebookapp import NotebookApp
    
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
        
        if dev_mode:
            directory_to_walk = 'src'
        else:
            directory_to_walk = '.'


        with zipfile.ZipFile(temp_zip_filename, 'w') as zf:
            for dirname, subdirs, files in os.walk(directory_to_walk):
                for filename in files:
                    if os.path.basename(filename) != temp_zip_filename:
                        zf.write(os.path.join(dirname, filename))


        buf_size = 4096
        self.set_header('Content-Type', 'application/octet-stream')
        self.set_header('Content-Disposition', 'attachment; filename=' + temp_zip_filename)

        with open(temp_zip_filename, 'rb') as f:
            while True:
                data = f.read(buf_size)
                if not data:
                    break
                self.write(data)
        
        os.remove(temp_zip_filename)
        self.finish()


class ScriptedForms(NotebookApp):
    default_url = Unicode('/forms/')
    
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

    # A dirty hack to get tornado debug to work...
    # based on https://github.com/jupyter/kernel_gateway/blob/master/kernel_gateway/gatewayapp.py
    def init_webapp(self):

        if dev_mode:
            # Enable the same pretty logging the notebook uses
            enable_pretty_logging()

            # Configure the tornado logging level too
            logging.getLogger().setLevel(self.log_level)

            handlers = self.personality.create_request_handlers()

            self.web_app = tornado.web.Application(
                handlers=handlers,
                debug=True,
                kernel_manager=self.kernel_manager,
                session_manager=self.session_manager,
                contents_manager=self.contents_manager,
                kernel_spec_manager=self.kernel_manager.kernel_spec_manager,
                kg_auth_token=self.auth_token,
                kg_allow_credentials=self.allow_credentials,
                kg_allow_headers=self.allow_headers,
                kg_allow_methods=self.allow_methods,
                kg_allow_origin=self.allow_origin,
                kg_expose_headers=self.expose_headers,
                kg_max_age=self.max_age,
                kg_max_kernels=self.max_kernels,
                kg_api=self.api,
                kg_personality=self.personality,
                # Also set the allow_origin setting used by notebook so that the
                # check_origin method used everywhere respects the value
                allow_origin=self.allow_origin
            )

            # promote the current personality's "config" tagged traitlet values to webapp settings
            for trait_name, trait_value in self.personality.class_traits(config=True).items():
                kg_name = 'kg_' + trait_name
                # a personality's traitlets may not overwrite the kernel gateway's
                if kg_name not in self.web_app.settings:
                    self.web_app.settings[kg_name] = trait_value.get(obj=self.personality)
                else:
                    self.log.warning('The personality trait name, %s, conflicts with a kernel gateway trait.', trait_name)
        else:
            super(ScriptedForms, self).init_webapp()


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
    if dev_mode:
        ScriptedForms.launch_instance(
            password='', token='', port=8888, 
            ip='localhost', port_retries=0, 
            allow_origin='http://localhost:4200', open_browser=False,
            allow_headers='X-XSRFToken,Content-Type',
            allow_methods="DELETE")
    else:
        password_filename = 'password.txt'

        if os.path.exists(password_filename):
            with open(password_filename, 'r') as f:
                password = f.read()
        else:
            password = define_password(password_filename)
            with open(password_filename, 'w') as f:
                f.write(password)
                
        try:
            s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
            s.connect(('8.8.8.8', 1))
            ip = s.getsockname()[0]
        except:
            ip = socket.gethostbyname(socket.gethostname())

        
        ScriptedForms.launch_instance(password=password, port=7878, ip=ip)

if __name__ == "__main__":
    if dev_mode:
        main()
    else:
        main()
