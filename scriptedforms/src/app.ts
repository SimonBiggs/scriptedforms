// Scripted Forms -- Making GUIs easy for everyone on your team.
// Copyright (C) 2017 Simon Biggs

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import './app/style.css';

const userStyle = document.createElement('style');
userStyle.id = 'scripted-forms-custom-user-style';
document.getElementsByTagName('head').item(0).appendChild(userStyle);

import { Widget } from '@phosphor/widgets';
import { ServiceManager, ContentsManager } from '@jupyterlab/services';
import { ScriptedFormsWidget } from './app/widget';
import { AngularLoader } from './app/phosphor-angular-loader';
import { AppModule } from './app/app.module';

export function loadApp(): void {
  const serviceManager = new ServiceManager();
  const contentsManager = new ContentsManager();
  const angularLoader = new AngularLoader<AppModule>(AppModule);

  const formWidget = new ScriptedFormsWidget({
    serviceManager,
    contentsManager,
    angularLoader
  });

  // formWidget.content.initiliseScriptedForms();
  window.onresize = () => { formWidget.update(); };
  Widget.attach(formWidget, document.body);
}