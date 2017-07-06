#!/bin/bash

python python-server/open_dev_address.py

cd angular-frontend
yarn install
yarn run ng serve -- --port 5000 --deploy-url /forms


