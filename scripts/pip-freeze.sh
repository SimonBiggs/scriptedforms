#!/bin/bash
export PATH="~/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"

pyenv activate scriptedforms
pip install --upgrade -e ../
pip install --upgrade jupyterlab
pip freeze > ../requirements.txt
