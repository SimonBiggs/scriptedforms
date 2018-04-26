/*
 *  Copyright 2017 Simon Biggs
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { BoxLayout, Widget } from '@phosphor/widgets';
import { ServiceManager, ContentsManager } from '@jupyterlab/services';
import { Toolbar } from '@jupyterlab/apputils';

import { DocumentRegistry } from '@jupyterlab/docregistry';
import { PathExt } from '@jupyterlab/coreutils';

import { AngularWidget } from './phosphor-angular-loader';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

import { IScriptedForms } from './services/initialisation.service';

/*
 *  # Create your own Angular JupyterLab extension (cont.)
 *
 *  This is part of the guide available at
 *  <https://github.com/SimonBiggs/scriptedforms/blob/master/scriptedforms/docs/create-your-own-angular-jupyterlab-extension.md>
 *
 *  ## Creating the Angular Wrapper Widget
 *
 *  This is where the ScriptedForms AngularWrapperWidget is made. Note that the
 *  Angular Component functions are only ever called within the `run()` function.
 */

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
