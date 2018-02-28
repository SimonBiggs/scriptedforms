# coding: utf-8
"""JupyterLab command handler"""

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.
from __future__ import print_function

import logging
import os
import os.path as osp
import re

from .process import Process, WatchHelper

HERE = os.path.dirname(os.path.abspath(__file__))

# The regex for expecting the webpack output.
WEBPACK_EXPECT = re.compile(r'.*/index.out.js')

# The dev mode directory.
DEV_DIR = osp.realpath(os.path.join(HERE, '..', 'dev_mode'))


def pjoin(*args):
    """Join paths to create a real path.
    """
    return osp.realpath(osp.join(*args))


def watch_packages(logger=None):
    """Run watch mode for the source packages.
    Parameters
    ----------
    logger: :class:`~logger.Logger`, optional
        The logger instance.
    Returns
    -------
    A list of `WatchHelper` objects.
    """
    parent = pjoin(HERE, '..')

    if not osp.exists(pjoin(parent, 'node_modules')):
        yarn_proc = Process(['yarn'], cwd=parent, logger=logger)
        yarn_proc.wait()

    logger = logger or logging.getLogger('jupyterlab')
    ts_dir = osp.realpath(osp.join(HERE, '..', 'packages', 'metapackage'))

    # Run typescript watch and wait for compilation.
    ts_regex = r'.* Compilation complete\. Watching for file changes\.'
    ts_proc = WatchHelper(['yarn', 'run', 'watch'],
                          cwd=ts_dir, logger=logger, startup_regex=ts_regex)

    # Run the metapackage file watcher.
    tsf_regex = 'Watching the metapackage files...'
    tsf_proc = WatchHelper(['yarn', 'run', 'watch:files'],
                           cwd=ts_dir, logger=logger, startup_regex=tsf_regex)

    return [ts_proc, tsf_proc]


def watch_dev(logger=None):
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

    package_procs = watch_packages(logger)

    # Run webpack watch and wait for compilation.
    wp_proc = WatchHelper(['yarn', 'run', 'watch'],
                          cwd=DEV_DIR, logger=logger,
                          startup_regex=WEBPACK_EXPECT)

    return package_procs + [wp_proc]


if __name__ == '__main__':
    watch_dev(HERE)
