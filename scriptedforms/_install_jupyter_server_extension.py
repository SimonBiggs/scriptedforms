# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

import os
import json
from jupyter_core.paths import jupyter_config_dir


def install_jupyter_server_extension():
    config_path = os.path.join(
        jupyter_config_dir(), 'jupyter_notebook_config.json')

    with open(config_path, 'r') as file:
        cfg = json.load(file)

    server_extensions = (
        cfg.setdefault('NotebookApp', {}).setdefault('nbserver_extensions', {})
    )
    if 'scriptedforms' not in server_extensions.keys():
        cfg['NotebookApp']['nbserver_extensions']['scriptedforms'] = True

    with open(config_path, 'w') as file:
        json.dump(cfg, file, indent=2)
