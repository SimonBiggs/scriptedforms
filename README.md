# Setting up development environment

Using Ubuntu 16.04.2 -- http://releases.ubuntu.com/16.04/ubuntu-16.04.2-desktop-amd64.iso

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


## Install Windows 7Zip portable

https://nchc.dl.sourceforge.net/project/portableapps/7-Zip%20Portable/7-ZipPortable_16.04.paf.exe

Install to `./windows_libs/7zip`




## Install Windows Python

https://www.python.org/ftp/python/3.5.3/python-3.5.3-amd64.exe

Unticked all settings except pip. Install to C:\python35

## Install dependencies

    ./reinstall_requirements.sh

# Building

    production_build.sh

# Running

    wine ./dist/ScriptedForms.exe






