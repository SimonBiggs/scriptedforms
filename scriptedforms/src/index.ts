// scriptedforms
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and
// GNU Affrero General Public License as published by the Free Software
// Foundation, either version 3 of the License, or (at your option) any later
// version (the "AGPL-3.0+").

// You may not use this file except in compliance with both the Apache-2.0 AND
// the AGPL-3.0+ in combination (the "Combined Licenses").

// You may obtain a copy of the AGPL-3.0+ at

//     https://www.gnu.org/licenses/agpl-3.0.txt

// You may obtain a copy of the Apache-2.0 at

//     https://www.apache.org/licenses/LICENSE-2.0.html

// Unless required by applicable law or agreed to in writing, software
// distributed under the Combined Licenses is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See
// the Combined Licenses for the specific language governing permissions and
// limitations under the Combined Licenses.

import "./styles";
import "hammerjs";

import '@jupyterlab/theme-light-extension/style/variables.css'
import '@jupyterlab/codemirror/style/index.css';
import '@jupyterlab/rendermime/style/index.css';

import { BoxLayout, Widget } from "@phosphor/widgets";

import { ServiceManager, ContentsManager } from "@jupyterlab/services";

import { AngularWidget } from "@simonbiggs/phosphor-angular-loader";

import { AppComponent } from "./app.component";

import { AppModule } from "./app.module";

export namespace IScriptedFormsWidget {
  export interface IOptions {
    serviceManager: ServiceManager;
    contentsManager: ContentsManager;
  }
}

export class AngularWrapperWidget extends AngularWidget<
  AppComponent,
  AppModule
> {
  constructor(options: IScriptedFormsWidget.IOptions) {
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
    this.form = new AngularWrapperWidget(options);
    this.form.addClass("form");

    layout.addWidget(this.form);
    BoxLayout.setStretch(this.form, 0);
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
