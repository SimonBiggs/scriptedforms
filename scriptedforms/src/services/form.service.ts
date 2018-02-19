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

import { Injectable
  // , ComponentRef 
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IFormComponent } from '../form-builder-module/create-form-component-factory';
import { FormBuilderComponent } from '../form-builder-module/form-builder.component'


export interface FormStore {
  [sessionId: string]: { 
    template: BehaviorSubject<string>;
    component: IFormComponent;
  }
}

@Injectable()
export class FormService {
  currentFormSessionId: string;
  formStore: FormStore = {}
  formBuilderComponent: FormBuilderComponent;
  initialising: 'initialising' | 'ready' = 'initialising'
  formStatus: BehaviorSubject<'initialising' | 'ready'> = new BehaviorSubject(this.initialising)

  formInitialisation(sessionId: string) {
    this.formStatus.next('initialising')
    this.currentFormSessionId = sessionId
    if (!(sessionId in this.formStore)) {
      this.formStore[sessionId] = {
        template: new BehaviorSubject(null),
        component: null
      }

      this.formStore[sessionId].template.subscribe(template => {
        if (template !== null) {
          this.formBuilderComponent.buildForm(sessionId, template).then(component => {
            this.formStore[sessionId].component = component
            component.formReady.promise.then(() => {
              this.formStatus.next('ready')
            })
          });
        }
      })
    }
  }

  setTemplate(template: string, sessionId: string) {
    this.formStore[sessionId].template.next(template)
  }

  getTemplate(sessionId: string) {
    return this.formStore[sessionId].template.getValue()
  }
}