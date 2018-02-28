#!/bin/bash
export PATH="~/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"

pyenv uninstall scriptedforms
pyenv virtualenv 3.5.5 scriptedforms
pyenv activate scriptedforms
pip install --upgrade -e ../../
yes | pip uninstall scriptedforms
pip freeze > ../../requirements.txt
