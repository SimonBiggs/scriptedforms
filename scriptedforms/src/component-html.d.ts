// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.


/*
 *  # Create your own Angular JupyterLab extension (cont.)
 *
 *  This is part of the guide available at
 *  <https://github.com/SimonBiggs/scriptedforms/blob/master/scriptedforms/docs/create-your-own-angular-jupyterlab-extension.md>
 *
 *  ## The custom html loader module
 *
 *  Within [app.component.ts](./app/app.component.ts) the need for the special
 *  importing of Angular HTML templates is described.
 * 
 *  So that Typescript allows that process this type definition is needed.
 */


declare module "html-loader!*.component.html" {
  const content: string;
  export = content;
}
