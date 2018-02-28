# coding: utf-8

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

import os
import sys

jupyterlab_extracts_dir = os.path.abspath(os.path.join(
    __file__, '../dev_utilities/jupyterlab_extracts'))
sys.path.append(jupyterlab_extracts_dir)
from dev_utilities.jupyterlab_extracts.commands import watch  # noqa: E402

if __name__ == '__main__':
    procs = watch()
    procs[0].wait()
