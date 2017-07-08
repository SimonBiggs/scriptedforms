#!/bin/bash

# Not yet complete

cd ./angular-frontend
yarn
cd ../

wine ./windows_libs/python/python-3.5.3.amd64/python.exe -m pip --no-cache-dir install -r python-server/requirements.txt
