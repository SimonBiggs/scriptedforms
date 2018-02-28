#!/bin/bash
cd "$(dirname "$0")"/../../
python setup.py sdist upload -r pypi
cd - 
