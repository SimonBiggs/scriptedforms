# Creating an exe-bundle of ScriptedForms

## Overview

To creat an exe bundle of ScriptedForms and have it be able to run a wide range
of forms all of Python needs to be included as well as any potential packages
that might be imported by the forms themselves. Here is a set of instructions
that creates a portable bundle of ScriptedForms that includes pandas, numpy and
matplotlib. You will need to adjust these instructions if you need more
packages.

## Tested bundle creation environment

Counter-intuitively these instructions have been tested using a Linux Ubuntu
distribution. You will need to make appropriate adjustments if you wish to
create an exe-bundle on another OS.

### Ubuntu 16.04

Using [Ubuntu 16.04](http://releases.ubuntu.com/16.04.4/ubuntu-16.04.4-desktop-amd64.iso).

### Wine-Staging

Wine staging is installed using the following method:

<https://wiki.winehq.org/Ubuntu>

    wget -nc https://dl.winehq.org/wine-builds/Release.key
    sudo apt-key add Release.key
    sudo apt-add-repository https://dl.winehq.org/wine-builds/ubuntu/

    sudo apt-get install --install-recommends winehq-staging wine-staging-compat

### Install WinPython 3.5.4.1Zero.exe

<https://github.com/winpython/winpython/releases/download/1.9.20171031/WinPython-64bit-3.5.4.1Zero.exe>

Install to `./python` (relative to scriptedforms/exe-bundle).

### Install dependencies

    wine ./python/python-*/python.exe -m pip --no-cache-dir install scriptedforms numpy pandas matplotlib

### Testing that ScriptedForms works

    wine ./python/python-*/python.exe -m scriptedforms ./simple-form/simple.md

### Test the bat file

This currently doesn't work on Linux, need to test on Windows

    wine cmd
    scriptedforms ./simple-form/simple.md
