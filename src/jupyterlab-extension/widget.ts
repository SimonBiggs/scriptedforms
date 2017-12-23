// jupyterlab-form
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// the GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compiance with both the Apache-2.0 AND 
// the AGPL-3.0+ in combination.

// You may obtain a copy of the AGPL-3.0+ at

//     https://www.gnu.org/licenses/agpl-3.0.txt

// You may obtain a copy of the Apache-2.0 at 

//     https://www.apache.org/licenses/LICENSE-2.0.html

// Unless required by applicable law or agreed to in writing, software
// distributed under the Apache-2.0 and the AGPL-3.0+ is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the Apache-2.0 and the AGPL-3.0+ for the specific language governing 
// permissions and limitations under the Apache-2.0 and the AGPL-3.0+.

/*
The jupyterlab-form widget.

Currently there are two exported widgets. A results widget and a template
widget. The thought is that eventually I will collapse this into one. As in
the form widget will always be the 'results' widget. I imagine this will become
clearer as I sort out the data model.
*/

import {
  BoxLayout, Widget
} from '@phosphor/widgets';

import {
  AngularWidget
} from '@simonbiggs/phosphor-angular-loader';

import {
  AppComponent
} from '../angular-app/app.component';

import {
  AppModule
} from '../angular-app/app.module';

import {
  ServiceManager, ContentsManager, 
  Contents
} from '@jupyterlab/services';

import {
  ActivityMonitor,
  PathExt
} from '@jupyterlab/coreutils';

import {
  ABCWidgetFactory, DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  // Message
} from '@phosphor/messaging';

import {
  // IDocumentManager
} from '@jupyterlab/docmanager';

import {
  FormModel
} from './model';

const RENDER_TIMEOUT = 1000;





// export
// class BaseFormWidget extends AngularWidget<AppComponent, AppModule> {
//   _context: DocumentRegistry.Context;
//   _services: ServiceManager;

//   constructor(options: BaseFormWidget.IOptions) {
//     super(AppComponent, AppModule);

//     this.title.closable = true;
//     this.addClass('jp-formWidgets');

//     this._context = options.context;
//     this._services = options.services;

//     this.title.label = PathExt.basename(this._context.path);
//     this._context.pathChanged.connect(this._onPathChanged, this);

//     this.componentReady.promise.then(() => {
//       this.ngZone.run(() => {
//         this.componentInstance.sessionConnect(
//           this._services, this._context.path);
//       });
//     })
//   }

//   get context(): DocumentRegistry.Context {
//     return this._context;
//   }

//   private _onPathChanged(): void {
//     this.title.label = PathExt.basename(this._context.path);
//     this.ngZone.run(() => {
//       this.componentInstance.pathChanged(this._context.path);
//     });
//   }

//   protected onActivateRequest(msg: Message): void {
//     this.node.tabIndex = -1;
//     this.node.focus();
//   }
// }

export
namespace FormWidget {
  export
  interface IOptions {
    context: DocumentRegistry.Context;
    services: ServiceManager;
  }
}

export
class FormWidget extends AngularWidget<AppComponent, AppModule> implements DocumentRegistry.IReadyWidget {
  contentsManager = new ContentsManager()
  _context: DocumentRegistry.Context;
  _services: ServiceManager;
  model: FormModel;

  constructor(options: FormWidget.IOptions) {
    super(AppComponent, AppModule);

    this._context = options.context;
    this._services = options.services;
    this.addClass('jp-Form');

    this.model = this._context.model as FormModel;

    this._context.pathChanged.connect(this._onPathChanged, this);

    this.id = '@simonbiggs/jupyterlab-form/form';

    this.run(() => {
      this.componentInstance.setDocumentModel(this.model);
      this.componentInstance.sessionConnect(
        this._services, this._context.path);
    })
  }

  updateTemplate(template: string) {
    this.run(() => {
      this.componentInstance.modelReady().then(() => {
        this.componentInstance.setTemplateAndBuildForm(template);
      })
    });
  }

  // pullTemplateFromFile() {
  //   const formPath = this._context.model.modelDB.get('formPath') as IObservableString;

  //   this.contentsManager.get(formPath.text)
  //   .then((templateModel: Contents.IModel) => {
  //     this.ngZone.run(() => {
  //       this.componentInstance.setTemplateAndBuildForm(templateModel.content);
  //       // this.componentInstance.setFormResults(results);
  //     });
  //   })
  // }

  get ready() {
    return Promise.resolve();
  }

  get context(): DocumentRegistry.Context {
    return this._context;
  }

  private _onPathChanged(): void {
    this.run(() => {
      this.componentInstance.pathChanged(this._context.path);
    });
  }
};


export
namespace OpenFormWidget {
  export
  interface IOptions {
    context: DocumentRegistry.Context;
    services: ServiceManager;
    templateEditor?: Contents.IModel;
  }
}


class BaseOpenFormWidget extends Widget implements DocumentRegistry.IReadyWidget {
  _context: DocumentRegistry.Context;
  _services: ServiceManager;
  form: FormWidget;

  constructor(options: OpenFormWidget.IOptions) {
    super();

    this.addClass('jp-FormContainer');

    this.title.closable = true;
  }

  get ready() {
    return Promise.resolve();
  }

  get context(): DocumentRegistry.Context {
    return this._context;
  }

  setLayout(form: FormWidget) {
    let layout = this.layout = new BoxLayout();
    let toolbar = new Widget();
    toolbar.addClass('jp-Toolbar');

    layout.addWidget(toolbar);
    BoxLayout.setStretch(toolbar, 0);
    layout.addWidget(this.form);
    BoxLayout.setStretch(this.form, 1);
  }

  onPathChanged(): void {
    this.title.label = PathExt.basename(this._context.path);
  }

}


export
class OpenFormTemplateWidget extends BaseOpenFormWidget implements DocumentRegistry.IReadyWidget{
  private _monitor: ActivityMonitor<any, any> | null = null;

  constructor(options: OpenFormWidget.IOptions) {
    super(options);

    this.id = '@simonbiggs/jupyterlab-form/open-form-template';

    this._context = options.context;
    this._services = options.services;

    this.title.label = PathExt.basename(this._context.path);
    this._context.pathChanged.connect(this.onPathChanged, this);

    this.form = new FormWidget({
      context: this._context,
      services: this._services
    })

    this.setLayout(this.form)

    this._context.ready.then(() => {
      this.updateTemplate();
      this._monitor = new ActivityMonitor({
        signal: this._context.model.contentChanged,
        timeout: RENDER_TIMEOUT
      });
      this._monitor.activityStopped.connect(this.updateTemplate, this);
    });
  }

  updateTemplate() {
    const content = this._context.model.toString();
    // console.log(content)
    this.form.updateTemplate(content);
  }

  dispose(): void {
    if (this._monitor) {
      this._monitor.dispose();
    }
    super.dispose();
  }
}


export
namespace OpenFormTemplateWidgetFactory {
  export
  interface IOptions extends DocumentRegistry.IWidgetFactoryOptions {
    services: ServiceManager;
  }
}

export
class OpenFormTemplateWidgetFactory extends ABCWidgetFactory<OpenFormTemplateWidget, DocumentRegistry.IModel> {
  services: ServiceManager;

  constructor(options: OpenFormTemplateWidgetFactory.IOptions) {
    super(options);
    this.services = options.services;
    // options.modelName
  }

  protected createNewWidget(context: DocumentRegistry.Context): OpenFormTemplateWidget {
    return new OpenFormTemplateWidget({
      context: context,
      services: this.services
    });
  }
}


export
class OpenFormResultsWidget extends BaseOpenFormWidget implements DocumentRegistry.IReadyWidget{
  constructor(options: OpenFormWidget.IOptions) {
    super(options);

    this.id = '@simonbiggs/jupyterlab-form/open-form-results';

    console.log(options.templateEditor)

    this._context = options.context;
    this._services = options.services;

    this.title.label = PathExt.basename(this._context.path);
    this._context.pathChanged.connect(this.onPathChanged, this);

    this.form = new FormWidget({
      context: this._context,
      services: this._services
    })

    this.setLayout(this.form)

    this._context.ready.then(() => {
      this.updateTemplate();
    });
  }

  updateTemplate() {
    const content = this._context.model.toString();
    this.form.updateTemplate(content);
  }
}


export
namespace OpenFormResultsWidgetFactory {
  export
  interface IOptions extends DocumentRegistry.IWidgetFactoryOptions {
    services: ServiceManager;
  }
}

export
class OpenFormResultsWidgetFactory extends ABCWidgetFactory<OpenFormResultsWidget, DocumentRegistry.IModel> {
  services: ServiceManager;

  constructor(options: OpenFormResultsWidgetFactory.IOptions) {
    super(options);
    this.services = options.services;
    // options.modelName
  }

  protected createNewWidget(context: DocumentRegistry.Context, templateEditor?: Contents.IModel): OpenFormResultsWidget {
    return new OpenFormResultsWidget({
      context: context,
      services: this.services,
      templateEditor: templateEditor
    });
  }
}