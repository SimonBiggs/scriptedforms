#!/bin/bash

#./build_angular.sh

rm -rf build dist
mkdir -p build/lib
mkdir -p build/app/python
mkdir build/src

cp -R ./angular-frontend/dist ./build/app/angular
cp ./python-server/scriptedforms.py ./build/app/python/scriptedforms.py
cp -R ./windows_libs/python ./build/lib/python

git add -A; snapshot=`git stash create`; git archive -o build/src/source_code.zip ${snapshot:-HEAD}

wine ./windows_libs/bat2exe.exe -bat ./bootstrap.bat -save ./build/scriptedforms.exe

mkdir dist

cd build
zip -r ../dist/scriptedforms.zip app/ lib/ scriptedforms.exe
