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

import './style.css';

/*
Jupyterlab Syntax Highlighting
*/
import '../node_modules/@jupyterlab/theme-light-extension/style/variables.css'
import '../node_modules/@jupyterlab/codemirror/style/index.css';
import '../node_modules/@jupyterlab/rendermime/style/index.css';

import {
  Widget
} from '@phosphor/widgets';

import {
  ScriptedFormsWidget
} from '../../packages/scriptedforms';

import {
  ServiceManager, ContentsManager
} from '@jupyterlab/services';


function main(): void {
  let serviceManager = new ServiceManager();
  let contentsManager = new ContentsManager();
  let formConfig = JSON.parse(document.getElementById(
    'scriptedforms-config-data'
  ).textContent)

  let path: string = formConfig.formFile
  let renderType: 'template' | 'results' = formConfig.renderType

  let formWidget = new ScriptedFormsWidget({
    serviceManager,
    contentsManager,
    path,
    renderType
  });

  window.onresize = () => { formWidget.update(); };
  Widget.attach(formWidget, document.body);
}

window.onload = main;
