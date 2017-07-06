#!/bin/bash

rm -rf build dist
export DEBUG="False"
export NAME="ScriptedForms"
wine ~/.wine/drive_c/python35/Scripts/pyinstaller.exe --onefile python-server/build.spec

