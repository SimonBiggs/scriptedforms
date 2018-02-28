# coding: utf-8
"""JupyterLab command handler"""

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.
from __future__ import print_function

import logging
import os
import os.path as osp
import re

from .process import WatchHelper

scriptedforms_package_dir = os.path.abspath(osp.join(__file__, '../../'))

# The regex for expecting the webpack output.
WEBPACK_EXPECT = re.compile(r'.*/index.out.js')


def pjoin(*args):
    """Join paths to create a real path.
    """
    return osp.realpath(osp.join(*args))


def watch(logger=None):
    """Run watch mode in a given directory.
    Parameters
    ----------
    logger: :class:`~logger.Logger`, optional
        The logger instance.
    Returns
    -------
    A list of `WatchHelper` objects.
    """
    logger = logger or logging.getLogger('jupyterlab')

    # Run webpack watch and wait for compilation.
    wp_proc = WatchHelper(['yarn', 'run', 'watch'],
                          cwd=scriptedforms_package_dir, logger=logger,
                          startup_regex=WEBPACK_EXPECT)

    return [wp_proc]


if __name__ == '__main__':
    watch()
