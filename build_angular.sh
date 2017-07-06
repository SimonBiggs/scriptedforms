#!/bin/bash

cd angular-frontend
yarn install
yarn run ng build -- --no-aot --prod --deploy-url /forms
cd ../
