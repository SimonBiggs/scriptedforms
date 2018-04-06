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