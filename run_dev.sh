#!/bin/bash

# Not yet complete

cd ./angular
gnome-terminal --window-with-profile=devel -e 'yarn run forms'
gnome-terminal --window-with-profile=devel -e 'yarn run kernel'
cd ../

python -m webbrowser -t "http://localhost:4200"
