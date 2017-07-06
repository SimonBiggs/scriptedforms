#!/bin/bash

./build_angular.sh
./build_pyinstaller.sh

wine ./dist/ScriptedQAForms.exe

