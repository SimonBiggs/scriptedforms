// Scripted Forms -- Making GUIs easy for everyone on your team.
// Copyright (C) 2017 Simon Biggs

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version (the "AGPL-3.0+").

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License and the additional terms for more
// details.

// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

// ADDITIONAL TERMS are also included as allowed by Section 7 of the GNU
// Affrero General Public License. These aditional terms are Sections 1, 5,
// 6, 7, 8, and 9 from the Apache License, Version 2.0 (the "Apache-2.0")
// where all references to the definition "License" are instead defined to
// mean the AGPL-3.0+.

// You should have received a copy of the Apache-2.0 along with this
// program. If not, see <http://www.apache.org/licenses/LICENSE-2.0>.

import "./jupyterlab-styles"
import "./angular-styles"
import "./style.css";

import "hammerjs";

import { enableProdMode } from '@angular/core';

import { BoxLayout, Widget } from "@phosphor/widgets";

import { ServiceManager, ContentsManager } from "@jupyterlab/services";

import {
  // showDialog, Dialog, Styling, 
  Toolbar, 
  // ToolbarButton
} from '@jupyterlab/apputils';

import { AngularWidget } from "./phosphor-angular-loader";

import { AppComponent } from "./app.component";

import { AppModule } from "./app.module";

if (process.env.production) {
  console.log('angular in production mode')
  enableProdMode();
}

export namespace IScriptedFormsWidget {
  export interface IOptions {
    serviceManager: ServiceManager;
    contentsManager: ContentsManager;
  }
}

export namespace IAngularWrapperWidget {
  export interface IOptions {
    toolbar: Toolbar<Widget>;
    serviceManager: ServiceManager;
    contentsManager: ContentsManager;
  }
}


export class AngularWrapperWidget extends AngularWidget<
  AppComponent,
  AppModule
> {
  constructor(options: IAngularWrapperWidget.IOptions) {
    super(AppComponent, AppModule);

    let scriptedFormsOptions = Object.assign(
      {
        node: this.node
      },
      options
    );

    this.run(() => {
      this.componentInstance.initiliseScriptedForms(scriptedFormsOptions);
    });
  }

  // updateFileContents(template: string) {
  //   this.run(() => {
  //     this.componentInstance.updateFileContents(template);
  //   });
  // }
}

export class ScriptedFormsWidget extends Widget {
  form: AngularWrapperWidget;

  constructor(options: IScriptedFormsWidget.IOptions) {
    super();
    this.addClass("container");

    let layout = (this.layout = new BoxLayout());
    let toolbar = new Toolbar();
    toolbar.addClass('jp-NotebookPanel-toolbar');
    toolbar.addClass('custom-toolbar');
    layout.addWidget(toolbar);
    BoxLayout.setStretch(toolbar, 0);

    let angularWrapperWidgetOptions = Object.assign({ toolbar }, options);

    this.form = new AngularWrapperWidget(angularWrapperWidgetOptions);
    this.form.addClass("form");


    layout.addWidget(this.form);
    BoxLayout.setStretch(this.form, 1);
  }
}




function main(): void {
  let serviceManager = new ServiceManager();
  let contentsManager = new ContentsManager();

  let formWidget = new ScriptedFormsWidget({
    serviceManager,
    contentsManager
  });

  window.onresize = () => { formWidget.update(); };
  Widget.attach(formWidget, document.body);
}

window.onload = main;
