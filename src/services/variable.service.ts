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

/*
This will eventually be how the variables are saved.

Not yet implemented.
*/

import {
  Kernel
} from '@jupyterlab/services';

import * as  stringify from 'json-stable-stringify';

import { Injectable } from '@angular/core';
import { KernelService } from './kernel.service';

import { VariableStore } from '../interfaces/variable-store'
import { VariableValue } from '../types/variable-value';

import { VariableComponent } from '../types/variable-component';


@Injectable()
export class VariableService {
  variableStore: VariableStore;
  oldVariableStore: VariableStore;

  componentStore: {
    [key: string]: VariableComponent
  } = {}

  fetchAllCodeStart: string = `print('{"version": "0.1.0"')
`
  fetchAllCode: string = ''
  fetchAllCodeEnd: string = `
print('}')`

  constructor(
    private myKernelSevice: KernelService
  ) { }

  resetVariableService() {
    this.variableStore = {};
    this.oldVariableStore = {};
    this.componentStore = {};
    this.fetchAllCode = '';
  }

  initialiseVariableComponent(component: VariableComponent) {
    const variableIdentifier = component.variableIdentifier
    this.componentStore[variableIdentifier] = component
    
    const variableReference = component.pythonVariableReference();
    this.appendToFetchAllCode(variableIdentifier, variableReference);
  }

  appendToFetchAllCode(variableIdentifier: string, variableReference: string) {
    let fetchCode = this.createFetchCode(variableReference);
    let fetchAllCodeAppend = `print(',"${variableIdentifier}":')
${fetchCode}`

    this.fetchAllCode = this.fetchAllCode.concat(fetchAllCodeAppend)
  }

  createFetchCode(variableReference: string): string {
    let fetchCode = `
try:
    print('{{ "defined": true, "value": {} }}'.format(${variableReference}))
except:
    print('{"defined": false}')
`;
    return fetchCode;
  }

  fetchAll() {
    this.myKernelSevice.runCode(
      this.fetchAllCodeStart.concat(this.fetchAllCode, this.fetchAllCodeEnd), 
      '"fetchAllVariables"')
    .then((future: Kernel.IFuture) => {
      if (future) {
        let textContent = '';
        future.onIOPub = (msg => {
          if (msg.content.text) {
            textContent = textContent.concat(String(msg.content.text))
            try {
              let result = JSON.parse(textContent)
              this.variableStore = result
              this.checkForChanges()
            } catch (err) {
              console.log(textContent)
            }
          }
        }); 
      }
    })
  }

  checkForChanges() {
    const variableIdentifiers = Object.keys(this.componentStore);

    for (let identifier of variableIdentifiers) {
      if (this.variableStore[identifier].defined) {
        if (this.oldVariableStore) {
          if (stringify(this.variableStore[identifier]) != stringify(this.oldVariableStore[identifier])) {
            this.updateComponentView(
              this.componentStore[identifier], this.variableStore[identifier].value)
          }
        } else {
          this.updateComponentView(
            this.componentStore[identifier], this.variableStore[identifier].value)
        } 
      }
    }
    this.oldVariableStore = JSON.parse(JSON.stringify(this.variableStore));
  }

  updateComponentView(component: any, value: VariableValue) {
    component.updateVariableView(value);
  }

  pushVariable(variableIdentifier: string, variableName: string, valueReference: string) {
    let pushCode = `${variableName} = ${valueReference}`
    
    this.oldVariableStore[variableIdentifier] = {
      defined: true,
      value: JSON.parse(JSON.stringify(valueReference))
    }

    return this.myKernelSevice.runCode(
      pushCode, '"push"_"' + variableIdentifier + '"'
    ).then(future => {
      // console.log(future)
      if (future) {
        const promise = future.done
        future.done.then(() => {
          this.fetchAll();
        })
        return promise;
      } else {
        return Promise.resolve('ignore');
      }
    })
  }
}
