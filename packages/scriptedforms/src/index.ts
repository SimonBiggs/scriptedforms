// scriptedforms
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compiance with both the Apache-2.0 AND 
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

import './styles';
import 'hammerjs';

import {
  BoxLayout, Widget
} from '@phosphor/widgets';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  AngularWidget
} from '@simonbiggs/phosphor-angular-loader';

import {
  AppComponent
} from './app.component';

import {
  AppModule
} from './app.module';

import {
  SessionConnectOptions
} from './interfaces/session-connect-options';


export
namespace IScriptedFormsWidget {
  export
  interface IOptions extends SessionConnectOptions {}
}


export
class ScriptedFormsWidget extends AngularWidget<AppComponent, AppModule> {
  constructor(options: IScriptedFormsWidget.IOptions) {
    super(AppComponent, AppModule)

    this.run(() => {
      this.componentInstance.sessionConnect(options);
    })
  }

  updateTemplate(template: string): Promise<void> {
    let formViewInitialised = new PromiseDelegate<void>();

    this.run(() => {
      this.componentInstance.modelReady().then(() => {
        this.componentInstance.setTemplateAndBuildForm(template).then(() => {
          formViewInitialised.resolve(null)
        })
      })
    });

    return formViewInitialised.promise
  }
}

export
class FormWidget extends Widget {
  form: ScriptedFormsWidget;

  constructor(options: IScriptedFormsWidget.IOptions) {
    super()
    this.addClass('container')

    let layout = this.layout = new BoxLayout();
    this.form = new ScriptedFormsWidget(options)
    this.form.addClass('form');

    layout.addWidget(this.form);
    BoxLayout.setStretch(this.form, 0);
  }
  
  updateTemplate(template: string) {
    let priorOverflow = this.form.node.scrollTop
    this.form.updateTemplate(template).then(() => {
      this.form.node.scrollTop = priorOverflow
    })
  }
};