#!/bin/bash

# Not yet complete

cd ./angular
yarn run forms &
yarn run kernel &
cd ../

python -m webbrowser -t "http://localhost:4200"
