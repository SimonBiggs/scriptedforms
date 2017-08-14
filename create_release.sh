#!/bin/bash

rm -rf build dist

cd ./scriptedforms/angular
yarn run deploy-app
cd ../../

mkdir -p build/lib
mkdir -p build/app/angular
mkdir -p build/app/python/kernel
mkdir build/src
mkdir build/tmp

cp -R ./scriptedforms/angular/dist/* ./build/app/angular/
cp ./scriptedforms/python/kernel/scriptedforms.py ./build/app/python/kernel/scriptedforms.py
cp -R ./windows_libs/python ./build/lib/python

git add -A; snapshot=`git stash create`; git archive -o ./build/tmp/scriptedforms.zip ${snapshot:-HEAD}

unzip ./build/tmp/scriptedforms.zip -d ./build/src
cp LICENSE build/LICENSE

wine ./windows_libs/bat2exe.exe -bat ./bootstrap.bat -save ./build/scriptedforms.exe

rm -rf ./build/tmp

mkdir dist

cd build
zip -r ../dist/scriptedforms.zip *
