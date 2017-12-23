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

import {
  JupyterLab, ILayoutRestorer
} from '@jupyterlab/application';

import {
  ISettingRegistry
} from '@jupyterlab/coreutils';

import {
  ILauncher
} from '@jupyterlab/launcher';

import {
  IDocumentManager
} from '@jupyterlab/docmanager';

import {
  InstanceTracker
} from '@jupyterlab/apputils';

import {
  OpenFormTemplateWidget, OpenFormTemplateWidgetFactory,
  OpenFormResultsWidget,
  OpenFormResultsWidgetFactory
} from './widget';

import {
  FormModelFactory,
} from './model';

import {
  setLauncher
} from './launcher';

import {
  formTemplateFactoryName, formResultsFactoryName,
  formTemplateFileExt, formResutsFileExt
} from './constants'


export
function activate(app: JupyterLab, restorer: ILayoutRestorer, docManager: IDocumentManager, settingRegistry: ISettingRegistry, launcher: ILauncher | null) {  
  
    // Add new file types
    app.docRegistry.addFileType({
      name: 'form-template',
      mimeTypes: ['text/markdown'],
      extensions: [formTemplateFileExt],
      contentType: 'file',
      fileFormat: 'text'
    });
  
    app.docRegistry.addFileType({
      name: 'form-results',
      mimeTypes: ['application/x-form+json'],
      extensions: [formResutsFileExt],
      contentType: 'file',
      fileFormat: 'json'
    });
  
    // Define the widget factories
    const openFormTemplateWidgetFactory = new OpenFormTemplateWidgetFactory({
      name: formTemplateFactoryName,
      fileTypes: ['form-template'],
      defaultFor: ['form-template'],
      readOnly: true,
      services: app.serviceManager
    });
  
    const openFormResultsWidgetFactory = new OpenFormResultsWidgetFactory({
      name: formResultsFactoryName,
      modelName: 'form-results',
      fileTypes: ['form-results'],
      defaultFor: ['form-results'],
      services: app.serviceManager,
    });
  
    // Register factories
    app.docRegistry.addModelFactory(new FormModelFactory({}));
    app.docRegistry.addWidgetFactory(openFormTemplateWidgetFactory);
    app.docRegistry.addWidgetFactory(openFormResultsWidgetFactory);
  
    // Set up the trackers
    const formTemplateTracker = new InstanceTracker<OpenFormTemplateWidget>({
      namespace: '@simonbiggs/jupyterlab-form/open-form-template'
    });
  
    const formResultsTracker = new InstanceTracker<OpenFormResultsWidget>({
      namespace: '@simonbiggs/jupyterlab-form/open-form-results'
    });
  
    // Set up state restorers
    restorer.restore(formTemplateTracker, {
      command: 'docmanager:open',
      args: widget => ({ path: widget.context.path, factory: formTemplateFactoryName }),
      name: widget => widget.context.path
    });
  
    restorer.restore(formResultsTracker, {
      command: 'docmanager:open',
      args: widget => ({ path: widget.context.path, factory: formResultsFactoryName }),
      name: widget => widget.context.path
    });
  
    // Connect the trackers
    openFormTemplateWidgetFactory.widgetCreated.connect((sender, widget) => {
      formTemplateTracker.add(widget);
      widget.context.pathChanged.connect(() => { formTemplateTracker.save(widget); });
    });
  
    openFormResultsWidgetFactory.widgetCreated.connect((sender, widget) => {
      formResultsTracker.add(widget);
      widget.context.pathChanged.connect(() => { formResultsTracker.save(widget); });
    });
  
    if (launcher) {
      setLauncher({
        app, launcher, docManager
      })
    }
    
  }