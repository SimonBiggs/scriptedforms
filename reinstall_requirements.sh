#!/bin/bash

wine ~/.wine/drive_c/python35/Scripts/pip.exe freeze | xargs wine ~/.wine/drive_c/python35/Scripts/pip.exe uninstall -y
wine ~/.wine/drive_c/python35/Scripts/pip.exe install -r python-server/requirements.txt
