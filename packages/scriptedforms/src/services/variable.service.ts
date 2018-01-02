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
// import {
//   PromiseDelegate
// } from '@phosphor/coreutils';

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


@Injectable()
export class VariableService {
  variableStore: BehaviorSubject<VariableStore> = new BehaviorSubject({});
  oldVariableStore: VariableStore;

  variableIdentifierMap: {
    [key: string]: string
  } = {}

  variableEvaluateMap: {
    [key: string]: string
  } = {}

  variableChangedObservable: BehaviorSubject<VariableStore> = new BehaviorSubject({});

  executionCount: BehaviorSubject<nbformat.ExecutionCount> = new BehaviorSubject(null);
  lastCode: BehaviorSubject<string> = new BehaviorSubject(null);

  timestamps: BehaviorSubject<{
    [key: string]: number
  }> = new BehaviorSubject({})

  componentStore: {
    [key: string]: VariableComponent
  } = {}

  fetchVariablesCode: string = 'exec(scriptedforms_variable_handler.fetch_code)';

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
        if (code !== this.fetchVariablesCode) {
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
    this.variableIdentifierMap = {};
    this.variableEvaluateMap = {};
  }

  allVariablesInitilised() {
    let initialiseHandlerCode = `scriptedforms_variable_handler = scriptedforms.VariableHandler("""${JSON.stringify(this.variableEvaluateMap)}""")`
    this.myKernelSevice.runCode(initialiseHandlerCode, '"initialiseVariableHandler"')
    .then((future: Kernel.IFuture) => {
      future.done.then(() => {
        this.fetchAll()
      })
    })    
  }

  appendToIdentifierMap(variableIdentifier: string, variableName: string) {
    this.variableIdentifierMap[variableIdentifier] = variableName
  }

  appendToEvaluateMap(variableName: string, variableEvaluate: string) {
    if (!(variableName in this.variableEvaluateMap)) {
      this.variableEvaluateMap[variableName] = variableEvaluate
    }
  }

  initialiseVariableComponent(component: VariableComponent) {
    const variableIdentifier = component.variableIdentifier
    this.componentStore[variableIdentifier] = component
    
    const variableEvaluate = component.pythonVariableEvaluate();
    const variableName = component.variableName;

    this.appendToIdentifierMap(variableIdentifier, variableName);
    this.appendToEvaluateMap(variableName, variableEvaluate);
  }

  convertToVariableStore(textContent: string) {
    let result = JSON.parse(textContent)

    let newVariableStore: VariableStore = {}
    Object.entries(this.variableIdentifierMap).forEach(
      ([variableIdentifier, variableName]) => {
        newVariableStore[variableIdentifier] = result[variableName]
      }
    );
    this.variableStore.next(newVariableStore)
  }

  fetchAll() {
    // let fetchComplete = new PromiseDelegate<void> ();
    this.myKernelSevice.runCode(
      this.fetchVariablesCode, '"fetchAllVariables"')
    .then((future: Kernel.IFuture) => {
      if (future) {
        let textContent = '';
        future.onIOPub = (msg => {
          if (msg.content.text) {
            textContent = textContent.concat(String(msg.content.text))
            try {
              this.convertToVariableStore(textContent)              
              this.checkForChanges()
            } catch (err) {
              console.log(textContent)
            }
          }
        });
        future.done.then(() => {

          // fetchComplete.resolve(null);
        })
      }
    })

    // return fetchComplete.promise
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
    let aVariableHasChanged = (stringify(this.variableStore.getValue()) != stringify(this.oldVariableStore));
    if (aVariableHasChanged) {
      this.variableChangedObservable.next(this.variableStore.getValue())
    }
    this.oldVariableStore = JSON.parse(JSON.stringify(this.variableStore.getValue()));
  }

  pushVariable(variableIdentifier: string, variableName: string, valueReference: string) {
    let pushCode = `${variableName} = ${valueReference}`

    this.updateTimestamp(variableIdentifier)
    
    this.oldVariableStore[variableIdentifier] = {
      defined: true,
      value: JSON.parse(JSON.stringify(valueReference))
    }

    return this.myKernelSevice.runCode(
      pushCode, '"push"_"' + variableIdentifier + '"'
    ).then(future => {
      if (future) {
        const promise = future.done
        return promise;
      } else {
        return Promise.resolve('ignore');
      }
    })
  }
}
