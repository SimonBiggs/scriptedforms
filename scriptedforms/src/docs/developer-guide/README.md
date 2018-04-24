# [WIP] Contributor documentation

## Links for the technologies used

* [Python](https://www.python.org/)
* [Markdown](http://commonmark.org/help/)
* [Typescript](https://www.typescriptlang.org/)
* [JupyterLab packages](http://jupyterlab.readthedocs.io):
  * [@jupyterlab/services](https://github.com/jupyterlab/jupyterlab/tree/master/packages/services)
  * [@jupyterlab/outputarea](https://github.com/jupyterlab/jupyterlab/tree/master/packages/outputarea)
* [Jupyter Notebook Server](http://jupyter-notebook.readthedocs.io)
* [Tornado](http://www.tornadoweb.org)
* [PhosphorJS](https://phosphorjs.github.io/)
* [Angular](https://angular.io/)
* [Angular Material](https://material.angular.io/)
* [Webpack](https://webpack.js.org/)

## Setting up a development environment

### Required tools

#### Yarn

Yarn is a javascript package manager built by Facebook. A key benefit of yarn
is its lock file `yarn.lock`. By using the lock file this means that everyone
will install the same version of the depenedency packages. This simplifies
set up on a new machine.

Yarn can be downloaded and installed from <https://yarnpkg.com/en/docs/install>

#### Python

Python 3.5 or greater is required. I personally use
[pyenv](https://github.com/pyenv/pyenv) to manage my Python version. However
to use this you either need to be running Linux or OSX, or optionally Windows
10 with the [Windows Subsystem for Linux](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

If you are on Windows I have found that the [Anaconda distribution of Python](https://www.anaconda.com/download)
produces the least headaches.

#### Git

Git is a software version control system. It allows multiple users to
collaborate on the code base. Each user can edit code on their own machine
and then merge the results onto [the GitHub repository](https://github.com/SimonBiggs/scriptedforms).

If you are on a Debian based Linux installing git is as simple as
`sudo apt-get install git`. If you are on OSX a recommended way to get git is
to [install homebrew](https://brew.sh/) and then run `brew install git`.

If you are on Windows it is recommended to [install Chocolatey](https://chocolatey.org/)
and then run `choco install git`.

#### GitHub account

GitHub is a website for the sharing of git based code repositories. You will
need to create a GitHub account.

### Recommended tools

#### Visual Studio Code

[Visual Studio Code](https://code.visualstudio.com/) is a brilliant open source
code editor by Microsoft. It is very useful for both Typescript and Python.

#### Linters

Flake8 is a linter for Python. Think of it as a spell check except for code.
Combined with Visual Studio Code it helps run sanity checks on your code as
you write it.