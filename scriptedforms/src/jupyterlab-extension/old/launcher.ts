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
  JupyterLab
} from '@jupyterlab/application';


import {
  FileEditor
} from '@jupyterlab/fileeditor';

import {
  DockPanel, Widget
} from '@phosphor/widgets';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  CodeMirrorEditor
} from '@jupyterlab/codemirror';

import {
  defaultFormContents
} from './default-form-contents';

import {
  Contents
} from '@jupyterlab/services';

import {
  ILauncher
} from '@jupyterlab/launcher';

import {
  IDocumentManager
} from '@jupyterlab/docmanager';

import {
  editorFactoryName, formResultsFactoryName,
  formTemplateFileExt, formResutsFileExt
} from './constants'



export 
function setLauncher(options: {
  app: JupyterLab, 
  launcher: ILauncher,
  docManager: IDocumentManager}
) {
  const app = options.app
  const launcher = options.launcher
  const docManager = options.docManager

  const callback = (cwd: string, name: string) => {
    return app.commands.execute(
      'docmanager:new-untitled', { path: cwd, type: 'file', ext: formTemplateFileExt }
    )
    .then((editorModel: Contents.IModel) => {
      // console.log(formModel)
      return app.commands.execute('docmanager:open', {
        path: editorModel.path, factory: editorFactoryName
      }).then((editor: FileEditor) => {
        const panelAny: any = editor.parent;
        const panel: DockPanel = panelAny;

        // console.log(formModel.path)

        // panel.layout.removeWidget(editor)
        panel.addWidget(editor, {
          mode: 'split-left'
        });

        const codeMirrorAny: any = editor.editor;
        const codeMirror: CodeMirrorEditor = codeMirrorAny;

        return editor.ready.then(() => {
          codeMirror.doc.setValue(defaultFormContents);
        });

      })
      .then(() => {
        let formWidgetPromise = new PromiseDelegate<Widget>()

        // The \d is a workaround for https://github.com/jupyterlab/jupyterlab/issues/3113
        // let baseName = editorModel.path.match(/^(.*)\.form\d*\.md$/)[1]
        let extensionMatch = editorModel.path.match(/^(.*)\.form*\.md$/)

        if (extensionMatch === null) {
          throw RangeError("The created form does not have the extension '.form.md'")
        }

        let baseName = editorModel.path.match(/^(.*)\.form*\.md$/)[1]
        let resultsName = baseName.concat(formResutsFileExt)

        // docManager.createNew(resultsName, FORMRESULTSFACTORY)
        let getResultsFilePromise = app.serviceManager.contents.get(resultsName, { content: false })
        getResultsFilePromise.then((formContentModel: Contents.IModel) => {
          app.commands.execute('docmanager:open', {
            path: formContentModel.path, factory: formResultsFactoryName
          }).then(widget => {
            formWidgetPromise.resolve(widget)
          });
        })

        getResultsFilePromise.catch(() => {
          app.serviceManager.contents.newUntitled({
            path: cwd,
            ext: formResutsFileExt,
            type: 'file'
          }).then((formContentModel: Contents.IModel) => {
            console.log()
            return docManager.rename(formContentModel.path, resultsName)
          })
          .then((formContentModel: Contents.IModel) => {
            app.commands.execute('docmanager:open', {
              path: formContentModel.path, factory: formResultsFactoryName
            }).then(widget => {
              formWidgetPromise.resolve(widget)
            })
          })
        })

        return formWidgetPromise.promise;

      });
    });
  };

  launcher.add({
    displayName: 'Form',
    callback: callback
  });
}