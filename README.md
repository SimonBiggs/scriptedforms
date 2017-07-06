# Setting up development environment

Using Ubuntu 16.04.2 -- http://releases.ubuntu.com/16.04/ubuntu-16.04.2-desktop-amd64.iso

## Install Wine-Staging

https://wiki.winehq.org/Ubuntu

    wget -nc https://dl.winehq.org/wine-builds/Release.key
    sudo apt-key add Release.key
    sudo apt-add-repository https://dl.winehq.org/wine-builds/ubuntu/

    sudo apt-get install --install-recommends winehq-staging wine-staging-compat

## Install Windows Python

https://www.python.org/ftp/python/3.5.3/python-3.5.3-amd64.exe

Unticked all settings except pip. Install to C:\python35

## Install dependencies

    wine ~/.wine/drive_c/python35/Scripts/pip.exe install -r requirements.txt

# Building

    wine ~/.wine/drive_c/python35/Scripts/pyinstaller.exe --onefile python-server/hello_world.spec

# Running

    wine ./dist/hello_world.exe






