"""
Copyright (c) Jupyter Development Team.
Distributed under the terms of the Modified BSD License.
"""
import os
from notebook.notebookapp import NotebookApp
from jinja2 import FileSystemLoader
from notebook.base.handlers import IPythonHandler, FileFindHandler
from traitlets import Unicode


HERE = os.path.dirname(__file__)
LOADER = FileSystemLoader(HERE)


class ScriptedFormsHandler(IPythonHandler):
    """Handle requests between the main app page and notebook server."""

    def get(self, form_file):
        """Get the main page for the application's interface."""
        return self.write(self.render_template("index.html",
            static=self.static_url, base_url=self.base_url,
            token=self.settings['token'], form_file=form_file))

    def get_template(self, name):
        return LOADER.load(self.settings['jinja2_env'], name)


class ScriptedForms(NotebookApp):
    """A notebook app that runs the example."""

    default_url = Unicode('/scriptedforms/demo.form.md')

    def start(self):
        handlers = [
            (r'/scriptedforms/([^/]*)', ScriptedFormsHandler),
            (r"/scriptedforms/javascript/(.*)", FileFindHandler,
                {'path': os.path.join(HERE, 'build')}),
        ]
        self.web_app.add_handlers(".*$", handlers)
        super(ScriptedForms, self).start()


def main():
    ScriptedForms.launch_instance()

if __name__ == '__main__':
    main()