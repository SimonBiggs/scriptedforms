## Download link

Windows:
https://www.dropbox.com/sh/0t1zjpmf9j5edyf/AABLUrqkwTpIIZHiWlvHHZqUa?dl=1


# Setting up development environment

Using Ubuntu 16.04.2 -- http://releases.ubuntu.com/16.04/ubuntu-16.04.2-desktop-amd64.iso

## Allow more listeners

    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p


## Requirements to just run from source on Linux

### Install Python and python libraries

    curl -L https://raw.githubusercontent.com/pyenv/pyenv-installer/master/bin/pyenv-installer | bash
    
Add the following to ~/.bashrc

    export PATH="~/.pyenv/bin:$PATH"
    eval "$(pyenv init -)"
    eval "$(pyenv virtualenv-init -)"

Open new terminal

    sudo apt-get install -y make build-essential libssl-dev zlib1g-dev libbz2-dev \
      libreadline-dev libsqlite3-dev wget curl llvm libncurses5-dev libncursesw5-dev \
      xz-utils tk-dev
    pyenv install 3.5.3
    pyenv global 3.5.3


#### Install python libraries

    pip install -r ./python/requirements.txt
    
### Install Node and node libraries

    curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.2/install.sh | bash
    source ~/.bashrc
    nvm install node
    nvm use node

    curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
    echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
    
    sudo apt-get update && sudo apt-get install yarn

#### Install node libraries
    
    cd angular
    yarn
    cd ../

### Run server

Start server:

    cd angular
    yarn run kernel
    yarn run forms

Open http://localhost:4200

## Recommended IDE

https://code.visualstudio.com/


## Requirements to be able to create Windows release


### Install Wine-Staging

https://wiki.winehq.org/Ubuntu

    wget -nc https://dl.winehq.org/wine-builds/Release.key
    sudo apt-key add Release.key
    sudo apt-add-repository https://dl.winehq.org/wine-builds/ubuntu/
    sudo apt update
    sudo apt-get install --install-recommends winehq-staging wine-staging-compat

### Download Bat to EXE Converter

http://www.f2ko.de/en/b2e.php

Extract portable `Bat_To_Exe_Converter_(x64).exe` and rename it to be: `./windows_libs/bat2exe.exe`

### Install WinPython 3.5.2.1Zero.exe

https://github.com/winpython/winpython/releases/download/1.7.20170401/WinPython-64bit-3.5.3.1Zero.exe

Install to `./windows_libs/python`

Run:
    
    ./set_up_dev_environment.sh

### Create release

    ./create_release.sh








