import os
from jupyterlab.tests.test_app import ProcessTestApp

class KarmaTestApp(ProcessTestApp):
    pass


def run_karma(base_dir):
    """Run a karma test in the given base directory.
    """
    app = KarmaTestApp.instance()
    app.karma_base_dir = base_dir
    app.initialize([])
    app.start()