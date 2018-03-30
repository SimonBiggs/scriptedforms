#!/bin/bash

printf 'Waiting for Selenium server to load\n'
until $(curl --output /dev/null --silent --head --fail http://localhost:4444/wd/hub); do
    printf '.'
    sleep 1
done
printf '\n'