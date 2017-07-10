# Setting up development environment

Using Ubuntu 16.04.2 -- http://releases.ubuntu.com/16.04/ubuntu-16.04.2-desktop-amd64.iso

## Allow more listeners

    echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf && sudo sysctl -p

## Install Wine-Staging

https://wiki.winehq.org/Ubuntu

    wget -nc https://dl.winehq.org/wine-builds/Release.key
    sudo apt-key add Release.key
    sudo apt-add-repository https://dl.winehq.org/wine-builds/ubuntu/

    sudo apt-get install --install-recommends winehq-staging wine-staging-compat

## Download Bat to EXE Converter

http://www.f2ko.de/en/b2e.php

Extract portable `Bat_To_Exe_Converter_(x64).exe` and rename it to be: `./windows_libs/bat2exe.exe`

## Install WinPython 3.5.2.1Zero.exe

https://github.com/winpython/winpython/releases/download/1.7.20170401/WinPython-64bit-3.5.3.1Zero.exe

Install to `./windows_libs/python`


## Install dependencies

    ./install_requirements.sh

# Building

    ./deployment_bundle.sh

# Running

    wine ./build/scriptedforms.exe 






