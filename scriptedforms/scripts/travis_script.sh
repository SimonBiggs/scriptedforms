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
    printf 'Waiting for Selenium Server to load\n'
    until $(curl --output /dev/null --silent --head --fail http://localhost:4444/wd/hub); do
        printf '.'
        sleep 1
    done
    printf '\n'
    yarn e2e
    cd - 
fi