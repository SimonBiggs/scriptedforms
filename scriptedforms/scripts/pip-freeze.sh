#!/bin/bash
export PATH="~/.pyenv/bin:$PATH"
eval "$(pyenv init -)"
eval "$(pyenv virtualenv-init -)"

yes | pyenv uninstall scriptedforms
pyenv virtualenv 3.5.5 scriptedforms
pyenv activate scriptedforms
pip install --upgrade -e "$(dirname "$0")"/../../
yes | pip uninstall scriptedforms
pip freeze > "$(dirname "$0")"/../../requirements.txt
