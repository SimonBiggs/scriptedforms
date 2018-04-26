# Create your own Angular JupyerLab extension

ScriptedForms is built on top of [Angular](https://angular.io) and it is
embedded within [PhosphorJS](http://phosphorjs.github.io/) so that it can be
provided as a [JupyterLab extension](http://jupyterlab.readthedocs.io/en/stable/developer/xkcd_extension_tutorial.html).

If you would like to use the above tools to create your own JupyterLab extension
this document is for you. If you just want to make your own JupyterLab extension
you should instead be reading the [xkcd extension tutorial](http://jupyterlab.readthedocs.io/en/stable/developer/xkcd_extension_tutorial.html).
If you just want to use ScriptedForms head on over to <http://scriptedforms.com.au>.

This guide assumes that you are comfortable using Angular, and you are
comfortable creating a basic JupyterLab extension.

## Overview

### Copying permissions

ScriptedForms itself is licensed under the AGPLv3.0+ license with additional terms.
However, so that you can make your own Angular JupyterLab extensions, and not
have to use the AGPLv3.0+ yourself, the specific files required to achieve this
in a bare bones fashion have been licensed either under the Apache 2.0+ or the
BSD. The choice of which license depends on whether or not that file was
derived from work done by the Jupyter team.

### Files specific to an Angular JupyterLab extension

The source code for the Angular portion of ScriptedForms is all contained within
[src](../src). The key files which are unique to the JupyterLab Angular
combination are listed below. Below the imports of each file a description is
provided which is aimed at the readers of this document. Please click through
each of the links below to read what each of the required files do and why they
are needed.

* [phosphor-angular-loader.ts](../src/app/phosphor-angular-loader.ts)
* [app.component.ts](../src/app/app.component.ts)
* [component-html.d.ts](../src/component-html.d.ts)
