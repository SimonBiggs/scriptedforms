#!/bin/bash

#./build_angular.sh

rm -rf build dist
mkdir -p build/lib
mkdir -p build/app/python

cp -R ./angular-frontend/dist ./build/app/angular
cp ./python-server/scriptedforms.py ./build/app/python/scriptedforms.py
cp -R ./windows_libs/python ./build/lib/python

wine ./windows_libs/bat2exe.exe -bat ./bootstrap.bat -save ./build/scriptedforms.exe

mkdir dist

cd build
zip -r ../dist/scriptedforms.zip app/ lib/ scriptedforms.exe
