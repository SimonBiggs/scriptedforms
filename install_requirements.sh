#!/bin/bash

# wine ./windows_libs/python/python-3.5.3.amd64/python.exe -m pip freeze | xargs wine ./windows_libs/python/python-3.5.3.amd64/python.exe -m pip  uninstall -y
wine ./windows_libs/python/python-3.5.3.amd64/python.exe -m pip --no-cache-dir install -r python-server/requirements.txt
