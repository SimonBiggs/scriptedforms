#!/bin/bash
cd "$(dirname "$0")"/../tests_e2e
yarn selenium
cd - 
