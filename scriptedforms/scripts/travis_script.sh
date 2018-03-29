#!/bin/bash

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

set -ex
export DISPLAY=:99.0
sh -e /etc/init.d/xvfb start || true

export PATH="$MINICONDA_DIR/bin:$PATH"
source activate test


if [[ $GROUP == e2e ]]; then
    cd "$(dirname "$0")"/../e2e
    yarn
    yarn selenium &
    yarn e2e
    cd - 
fi