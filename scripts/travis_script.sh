#!/bin/bash

# Copyright (c) Jupyter Development Team.
# Distributed under the terms of the Modified BSD License.

set -ex
export DISPLAY=:99.0
sh -e /etc/init.d/xvfb start || true

export PATH="$MINICONDA_DIR/bin:$PATH"
source activate test


if [[ $GROUP == py2 || $GROUP == py3 ]]; then
    # Run the python tests
    py.test -v
fi


if [[ $GROUP == js ]]; then

    jlpm build:packages
    jlpm build:test
    jlpm test
    jlpm run clean
fi


if [[ $GROUP == js_cov ]]; then

    jlpm run build:packages
    jlpm run build:test
    jlpm run coverage

    # Run the services node example.
    pushd packages/services/examples/node
    python main.py
    popd

    jlpm run clean
fi


if [[ $GROUP == js_services ]]; then

    jlpm build:packages
    jlpm build:test
    jlpm run test:services

fi