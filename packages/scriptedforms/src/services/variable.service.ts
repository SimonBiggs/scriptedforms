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

/*
This will eventually be how the variables are saved.

Not yet implemented.
*/

import { BehaviorSubject } from 'rxjs';

// import { Slot } from '@phosphor/signaling';
import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  Kernel, KernelMessage
} from '@jupyterlab/services';

import { nbformat } from '@jupyterlab/coreutils';

import * as  stringify from 'json-stable-stringify';

import { Injectable } from '@angular/core';
import { KernelService } from './kernel.service';

import { VariableStore } from '../interfaces/variable-store'
import { VariableValue } from '../types/variable-value';

import { VariableComponent } from '../types/variable-component';

// TO DO
// Make the variable service attach itself to kernel iopubmessage
// Don't specifically call the variable update. Instead make it so that each
// iopubmessage calls back to updating the variables.

// Think further about implications of two users editing one variable item.


// TO DO
// Make python only read each variable once. Variable store needs only to store
// the value of each variable once.

// A secondary variable, "variable component alignment" needs to align each 
// variable to its component, possibly multiple components.
@Injectable()
export class VariableService {
  variableStore: BehaviorSubject<VariableStore> = new BehaviorSubject({});
  oldVariableStore: VariableStore;

  executionCount: BehaviorSubject<nbformat.ExecutionCount> = new BehaviorSubject(null);
  lastCode: BehaviorSubject<string> = new BehaviorSubject(null);

  timestamps: BehaviorSubject<{
    [key: string]: number
  }> = new BehaviorSubject({})

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
  ) {
    this.myKernelSevice.sessionConnected.promise.then(() => {
      this.myKernelSevice.session.iopubMessage.connect((session, msg) => {
        if (KernelMessage.isExecuteInputMsg(msg)) {
          let executeInputMessage: KernelMessage.IExecuteInputMsg = msg
          this.executionCount.next(executeInputMessage.content.execution_count)
          this.lastCode.next(executeInputMessage.content.code)
        }
      })
    });

    this.lastCode.subscribe((code) => {
      if (code) {
        let fetchAllCode = this.fetchAllCodeStart.concat(this.fetchAllCode, this.fetchAllCodeEnd)
        if (code !== fetchAllCode) {
          this.fetchAll()
        }
      }
    })
  }

  resetVariableService() {
    this.timestamps.next({});
    this.variableStore.next({});
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
    let fetchComplete = new PromiseDelegate<void> ();

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
              this.variableStore.next(result)
              this.checkForChanges()
            } catch (err) {
              console.log(textContent)
            }
          }
        });
        future.done.then(() => {

          fetchComplete.resolve(null);
        })
      }
    })

    return fetchComplete.promise
  }

  updateComponentView(component: any, value: VariableValue) {
    component.updateVariableView(value);
  }

  updateTimestamp(identifier: string) {
    let timestamps = this.timestamps.getValue()
    timestamps[identifier] = Date.now()

    this.timestamps.next(timestamps)
  }

  variableHasChanged(identifier: string) {
    this.updateComponentView(
      this.componentStore[identifier], this.variableStore.getValue()[identifier].value)
    this.updateTimestamp(identifier)
    

    // console.log(this.timestamps)
  }

  checkForChanges() {
    const variableIdentifiers = Object.keys(this.componentStore);

    for (let identifier of variableIdentifiers) {
      if (this.variableStore.getValue()[identifier].defined) {
        if (this.oldVariableStore) {
          if (stringify(this.variableStore.getValue()[identifier]) != stringify(this.oldVariableStore[identifier])) {
            this.variableHasChanged(identifier)
          }
        } else {
          this.variableHasChanged(identifier)
        } 
      }
    }
    this.oldVariableStore = JSON.parse(JSON.stringify(this.variableStore.getValue()));
  }

  pushVariable(variableIdentifier: string, variableName: string, valueReference: string) {
    let pushCode = `${variableName} = ${valueReference}`

    this.updateTimestamp(variableIdentifier)

    // console.log(this.timestamps)
    
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
        // future.done.then(() => {
        //   this.fetchAll();
        // })
        return promise;
      } else {
        return Promise.resolve('ignore');
      }
    })
  }
}
