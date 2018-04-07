import { Widget } from '@phosphor/widgets';

import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  ISettingRegistry
} from '@jupyterlab/coreutils';

import {
  IDocumentManager
} from '@jupyterlab/docmanager';

import {
  ABCWidgetFactory, DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  ILauncher
} from '@jupyterlab/launcher';

import { ServiceManager, ContentsManager } from '@jupyterlab/services';
import { ScriptedFormsWidget } from './../app/widget';


export function loadApp(): void {
  const serviceManager = new ServiceManager();
  const contentsManager = new ContentsManager();

  const formWidget = new ScriptedFormsWidget({
    serviceManager,
    contentsManager
  });

  formWidget.form.initiliseScriptedForms();

  window.onresize = () => { formWidget.update(); };
  Widget.attach(formWidget, document.body);
}

export
namespace IScriptedFormsWidgetFactory {
  export
  interface IOptions extends DocumentRegistry.IWidgetFactoryOptions {
    serviceManager: ServiceManager;
    contentsManager: ContentsManager;
  }
}

export
class ScriptedFormsWidgetFactory extends ABCWidgetFactory<ScriptedFormsWidget, DocumentRegistry.IModel> {
  serviceManager: ServiceManager;
  contentsManager: ContentsManager;

  constructor(options: IScriptedFormsWidgetFactory.IOptions) {
    super(options);
    this.serviceManager = options.serviceManager;
    this.contentsManager = options.contentsManager;
  }

  protected createNewWidget(context: DocumentRegistry.Context): ScriptedFormsWidget {
    const formWidget = new ScriptedFormsWidget({
      serviceManager: this.serviceManager,
      contentsManager: this.contentsManager
    });

    formWidget.form.initiliseScriptedForms();

    return formWidget;
  }
}


function activate(
  app: JupyterLab, restorer: ILayoutRestorer, docManager: IDocumentManager,
  settingRegistry: ISettingRegistry, launcher: ILauncher | null
) {
  console.log('ScriptedForms is activated!');

  app.docRegistry.addFileType({
    name: 'scripted-form',
    mimeTypes: ['text/markdown'],
    extensions: ['.md'],
    contentType: 'file',
    fileFormat: 'text'
  });
}


export const extension: JupyterLabPlugin<void> = {
  id: 'ScriptedForms',
  autoStart: true,
  activate: activate
};
