#!/bin/bash

rm -rf build dist

cd ./scriptedforms/local-client
yarn run deploy
cd ../../

mkdir -p build/lib
mkdir -p build/app/local-server
mkdir build/src
mkdir build/tmp

cp -R ./scriptedforms/local-client/dist ./build/app/local-client
cp ./scriptedforms/local-server/scriptedforms.py ./build/app/local-server/scriptedforms.py
cp -R ./windows_libs/python ./build/lib/python

git add -A; snapshot=`git stash create`; git archive -o ./build/tmp/scriptedforms.zip ${snapshot:-HEAD}

unzip ./build/tmp/scriptedforms.zip -d ./build/src
rm -rf ./build/src/scriptedforms/gcloud-user-authentication
rm -rf ./build/src/scriptedforms/gcloud-website
cp LICENSE build/LICENSE

wine ./windows_libs/bat2exe.exe -bat ./bootstrap.bat -save ./build/scriptedforms.exe

rm -rf ./build/tmp

mkdir dist

cd build
zip -r ../dist/scriptedforms.zip *
