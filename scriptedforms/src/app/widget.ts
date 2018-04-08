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

import { BoxLayout, Widget } from '@phosphor/widgets';
import { ServiceManager, ContentsManager } from '@jupyterlab/services';
import { Toolbar } from '@jupyterlab/apputils';

import { DocumentRegistry } from '@jupyterlab/docregistry';
import { PathExt } from '@jupyterlab/coreutils';

import { AngularWidget } from './phosphor-angular-loader';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

import { IScriptedForms } from './services/initialisation.service';

export namespace IScriptedFormsWidget {
  export interface IOptions {
    serviceManager: ServiceManager;
    contentsManager: ContentsManager;
    context?: DocumentRegistry.Context;
  }
}

export namespace IAngularWrapperWidget {
  export interface IOptions {
    toolbar: Toolbar<Widget>;
    serviceManager: ServiceManager;
    contentsManager: ContentsManager;
    context?: DocumentRegistry.Context;
  }
}

export class AngularWrapperWidget extends AngularWidget<
  AppComponent,
  AppModule
> {

  scriptedFormsOptions: IScriptedForms.IOptions;

  constructor(options: IAngularWrapperWidget.IOptions) {
    super(AppComponent, AppModule);

    this.scriptedFormsOptions = Object.assign(
      {
        node: this.node
      },
      options
    );
  }

  initiliseScriptedForms() {
    this.run(() => {
      this.componentInstance.initiliseScriptedForms(this.scriptedFormsOptions);
    });
  }

  initiliseBaseScriptedForms() {
    this.run(() => {
      this.componentInstance.initiliseBaseScriptedForms(this.scriptedFormsOptions);
    });
  }

  setTemplateToString(dummyPath: string, template: string) {
    this.run(() => {
      this.componentInstance.setTemplateToString(dummyPath, template);
    });
  }
}

export class ScriptedFormsWidget extends Widget implements DocumentRegistry.IReadyWidget {
  _context: DocumentRegistry.Context;
  form: AngularWrapperWidget;
  id: 'ScriptedForms';

  constructor(options: IScriptedFormsWidget.IOptions) {
    super();
    if (options.context) {
      this._context = options.context;
      this.onPathChanged();
      this._context.pathChanged.connect(this.onPathChanged, this);
    }
    this.addClass('scripted-form-widget');

    const layout = (this.layout = new BoxLayout());
    const toolbar = new Toolbar();
    toolbar.addClass('jp-NotebookPanel-toolbar');
    toolbar.addClass('custom-toolbar');
    layout.addWidget(toolbar);
    BoxLayout.setStretch(toolbar, 0);

    const angularWrapperWidgetOptions = Object.assign({ toolbar }, options);

    this.form = new AngularWrapperWidget(angularWrapperWidgetOptions);
    this.form.addClass('form-container');

    layout.addWidget(this.form);
    BoxLayout.setStretch(this.form, 1);
  }

  get ready() {
    return Promise.resolve();
  }

  get context(): DocumentRegistry.Context {
    return this._context;
  }

  onPathChanged(): void {
    this.title.label = PathExt.basename(this._context.path);
  }

  dispose() {
    this.form.dispose();
    super.dispose();
  }
}
