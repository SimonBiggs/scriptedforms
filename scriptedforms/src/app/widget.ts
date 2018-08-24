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

import { Widget } from '@phosphor/widgets';
// import { Signal, ISignal } from '@phosphor/signaling';

import {
   ServiceManager, ContentsManager, 
  //  Contents 
} from '@jupyterlab/services';
import {
  Toolbar, 
  // MainAreaWidget
} from '@jupyterlab/apputils';
// import { IModelDB } from '@jupyterlab/observables';

import { 
  DocumentRegistry, DocumentWidget,
  // DocumentModel, Context 
} from '@jupyterlab/docregistry';

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

// class DummySignal {
//   get dummySignal(): ISignal<DocumentRegistry.IContext<DocumentRegistry.IModel>, DocumentRegistry.IModel> {
//     return this._dummySignal;
//   }
//   private _dummySignal = new Signal<DocumentRegistry.IContext<DocumentRegistry.IModel>, DocumentRegistry.IModel>(null);
// }


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

// interface IScriptedFormsModel extends DocumentRegistry.IModel {

// }

// class ScriptedFormsModelFactory implements DocumentRegistry.IModelFactory<IScriptedFormsModel> {
//   private _disposed = false;

//   get name(): string {
//     return 'scriptedform';
//   }

//   get contentType(): Contents.ContentType {
//     return 'file';
//   }

//   get fileFormat(): Contents.FileFormat {
//     return 'text';
//   }

//   createNew(languagePreference?: string, modelDB?: IModelDB): IScriptedFormsModel {
//     return new DocumentModel()
//   }

//   preferredLanguage(path: string): string {
//     return 'python';
//   }

//   get isDisposed(): boolean {
//     return this._disposed;
//   }

//   dispose(): void {
//     this._disposed = true;
//   }
// }

export function createScriptedFormsWidget(options: IScriptedFormsWidget.IOptions): DocumentWidget<AngularWrapperWidget> {
  const toolbar = new Toolbar();
  toolbar.addClass('jp-NotebookPanel-toolbar');
  toolbar.addClass('custom-toolbar');

  const angularWrapperWidgetOptions = Object.assign({ toolbar }, options);
  let content = new AngularWrapperWidget(angularWrapperWidgetOptions);
  content.addClass('form-container');

  let reveal = content.componentReady.promise

  // let context = options.context
  // if (context === undefined) {
  //   const dummySignal = new DummySignal();
  //   context = {
  //     ready: Promise.resolve(null),
  //     pathChanged: dummySignal.dummySignal,
  //     fileChanged: null,
  //     saveState: null,
  //     disposed: null,
  //     model: null,
  //     session: null,
  //     path: null,
  //     localPath: null,
  //     contentsModel: null,
  //     urlResolver: null,
  //     isReady: true,
  //     save: null,
  //     saveAs: null,
  //     revert: null,
  //     createCheckpoint: null,
  //     deleteCheckpoint: null,
  //     restoreCheckpoint: null,
  //     listCheckpoints: null,
  //     addSibling: null,
  //     isDisposed: false,
  //     dispose: null
  //   }
  // }

  const documentWidgetOptions = {
    content, toolbar, reveal, context: options.context
  }

  const documentWidget = new DocumentWidget<AngularWrapperWidget>(documentWidgetOptions);
  documentWidget.addClass('scripted-form-widget');
  documentWidget.content.initiliseScriptedForms();

  return documentWidget
}
