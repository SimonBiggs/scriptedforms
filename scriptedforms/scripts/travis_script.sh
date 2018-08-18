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

    if [[ $SAUCE_USERNAME ]]; then
        
        if [[ $? ]]; then
            SAUCE_API_PAYLOAD='{"passed": true}'
        else
            SAUCE_API_PAYLOAD='{"passed": false}'
        fi

        curl -X PUT \
        -s -d $SAUCE_API_PAYLOAD \
        -u $SAUCE_USERNAME:$SAUCE_ACCESS_KEY \
        https://saucelabs.com/rest/v1/$SAUCE_USERNAME/jobs/$SELENIUM_SESSION_ID 
    fi

    cd - 
fi