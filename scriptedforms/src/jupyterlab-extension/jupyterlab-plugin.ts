import { Widget } from '@phosphor/widgets';

import { JupyterLab, JupyterLabPlugin, ILayoutRestorer } from '@jupyterlab/application';
import { ISettingRegistry } from '@jupyterlab/coreutils';
import { ABCWidgetFactory, DocumentRegistry } from '@jupyterlab/docregistry';
import { ServiceManager, ContentsManager } from '@jupyterlab/services';
import { InstanceTracker } from '@jupyterlab/apputils';

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
      contentsManager: this.contentsManager,
      context: context
    });

    formWidget.form.initiliseScriptedForms();

    return formWidget;
  }
}

function activate(
  app: JupyterLab, restorer: ILayoutRestorer, settingRegistry: ISettingRegistry
) {
  console.log('ScriptedForms is activated!');

  app.docRegistry.addFileType({
    name: 'scripted-form',
    mimeTypes: ['text/markdown'],
    extensions: ['.md'],
    contentType: 'file',
    fileFormat: 'text'
  });

  const factory = new ScriptedFormsWidgetFactory({
    name: 'ScriptedFormsWidgetFactory',
    fileTypes: ['scripted-form'],
    readOnly: true,
    serviceManager: app.serviceManager,
    contentsManager: app.serviceManager.contents,
  });

  app.docRegistry.addWidgetFactory(factory);
  const tracker = new InstanceTracker<ScriptedFormsWidget>({
    namespace: '@simonbiggs/ScriptedForms'
  });

  restorer.restore(tracker, {
    command: 'docmanager:open',
    args: widget => ({ path: widget.context.path, factory: 'ScriptedFormsWidgetFactory' }),
    name: widget => widget.context.path
  });

  factory.widgetCreated.connect((sender, widget) => {
    tracker.add(widget);
    widget.context.pathChanged.connect(() => {
      tracker.save(widget);
    });
  });
}


export const extension: JupyterLabPlugin<void> = {
  id: 'ScriptedForms',
  autoStart: true,
  requires: [ILayoutRestorer, ISettingRegistry],
  activate: activate
};
