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

## Copying permissions

ScriptedForms itself is licensed under the AGPLv3.0+ license with additional terms.
However, so that you can make your own Angular JupyterLab extensions, and not
have to use the AGPLv3.0+ yourself, the specific files required to achieve this
in a bare bones fashion have been licensed either under the Apache 2.0+ or the
BSD. The choice of which license the file is under depends on whether or not
that file was derived from work done by the Jupyter team.

## Files specific to an Angular JupyterLab extension

The source code for the Angular portion of ScriptedForms is all contained within
[src](../src). The key files which are unique to the JupyterLab Angular
combination are listed below.

Key parts of this guide are actually contained as descriptive text within these
listed files. This descriptive text is below the package imports and looks something like:

```typescript
/*
 *  # Create your own Angular JupyterLab extension (cont.)
 *
 *  This is part of the guide available at
 *  <https://github.com/SimonBiggs/scriptedforms/blob/master/scriptedforms/docs/create-your-own-angular-jupyterlab-extension.md>
 *
 *  ...
 *
 */
```

Please click through each of the links below to read what each of the required
files do and why they are needed.

* [phosphor-angular-loader.ts](../src/app/phosphor-angular-loader.ts)
* [app.component.ts](../src/app/app.component.ts)
* [component-html.d.ts](../src/component-html.d.ts)
* [widget.ts](../src/app/widget.ts)
* [jupyterlab-plugin.ts](../src/jupyterlab-extension/jupyterlab-plugin.ts)

There are of course other files required. However they are not specific to this
particular combination.

If you believe more files from within ScriptedForms should be a part of this
guide please either [create an issue](https://github.com/SimonBiggs/scriptedforms/issues/new)
or a pull request to ScriptedForms.

## Providing your extension to JupyterLab

To build ScriptedForms ready to be installed as a JupyterLab extension `tsc` is run
and then html, css, and scss files are copied into the build directory. This command
uses the [tsconfig.json](../tsconfig.json) file.

This bundle of primarily css, html, and js is what is given to JupyterLab.

To see the specific JupyterLab build process have a look at the [package.json](../package.json)
file. In particular the "build:jlab" script. Also note how within "files" the "html"
extension has been included.

Importantly within the package.json file the `html-loader` is listed as a dependency
not a `devDependency`. That way JupyterLab will install the `html-loader` package when it is
building your extension.