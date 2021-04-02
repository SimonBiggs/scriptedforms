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

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { IFormComponent } from '../form-builder-module/create-form-component-factory';
import { FormBuilderComponent } from '../form-builder-module/form-builder.component';

import { FormStatus } from '../types/form-status';


@Injectable()
export class FormService {
  template: BehaviorSubject<string>;
  component: IFormComponent;

  formBuilderComponent: FormBuilderComponent;
  initialising: FormStatus = 'initialising';
  formStatus: BehaviorSubject<FormStatus> = new BehaviorSubject(this.initialising);

  formInitialisation() {
    this.formStatus.next('initialising');

    this.template = new BehaviorSubject(null);
    this.component = null;

    this.template.subscribe(template => {
      if (template !== null) {
        this.formBuilderComponent.buildForm(template).then(component => {
          this.component = component;
          component.formReady.promise.then(() => {
            this.formStatus.next('ready');
          });
        });
      }
    });
  }

  restartFormKernel() {
    this.formStatus.next('restarting');
    const formReadyPromise = this.component.restartFormKernel();
    formReadyPromise.then(() => {
      this.formStatus.next('ready');
    });
    return formReadyPromise;
  }

  setTemplate(template: string) {
    this.template.next(template);
  }

  getTemplate() {
    return this.template.getValue();
  }
}
