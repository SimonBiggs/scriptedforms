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
// import { FileService } from './file.service';

import { VariableStore } from '../interfaces/variable-store'
import { VariableValue } from '../types/variable-value';

import { VariableComponent } from '../types/variable-component';


export interface SessionVariableStore {
  [sessionId: string]: { 
    variableStore: BehaviorSubject<VariableStore>;
    oldVariableStore: VariableStore;
    variableIdentifierMap: {
      [key: string]: string
    };
    variableEvaluateMap: {
      [key: string]: string
    };
    pythonVariables: VariableStore;
    variableChangedObservable: BehaviorSubject<VariableStore>;
    timestamps: BehaviorSubject<{
      [key: string]: number
    }>;
    variableComponentStore: {
      [key: string]: VariableComponent
    };
    executionCount: BehaviorSubject<nbformat.ExecutionCount>;
    lastCode: BehaviorSubject<string>;
  }
}


@Injectable()
export class VariableService {
  sessionVariableStore: SessionVariableStore = {}
  // variableStore: BehaviorSubject<VariableStore> = new BehaviorSubject({});
  // oldVariableStore: VariableStore;

  // variableIdentifierMap: {
  //   [key: string]: string
  // } = {}

  // variableEvaluateMap: {
  //   [key: string]: string
  // } = {}

  // pythonVariables: VariableStore = {}

  // sessionsIopubConnected: string[] = []

  // variableChangedObservable: BehaviorSubject<VariableStore> = new BehaviorSubject({});

  // executionCount: BehaviorSubject<nbformat.ExecutionCount> = new BehaviorSubject(null);
  // lastCode: BehaviorSubject<string> = new BehaviorSubject(null);

  // timestamps: BehaviorSubject<{
  //   [key: string]: number
  // }> = new BehaviorSubject({})

  // componentStore: {
  //   [key: string]: VariableComponent
  // } = {}

  variableHandlerClass: string = '_VariableHandler'
  handlerName: string = '_scriptedforms_variable_handler'
  fetchVariablesCode: string = `exec(${this.handlerName}.fetch_code)`;

  constructor(
    private myKernelSevice: KernelService,
    // private myFileService: FileService
  ) { }

  variableInitialisation(sessionId: string) {
    if (!(sessionId in this.sessionVariableStore)) {
      this.sessionVariableStore[sessionId] = {
        variableStore: new BehaviorSubject({}),
        oldVariableStore: null,
        variableIdentifierMap: {},
        variableEvaluateMap: {},
        pythonVariables: {},
        variableChangedObservable: new BehaviorSubject({}),
        timestamps: new BehaviorSubject({}),
        variableComponentStore: {},
        executionCount: new BehaviorSubject(null),
        lastCode: new BehaviorSubject(null)
      }

      this.sessionVariableStore[sessionId].lastCode.subscribe((code) => {
        if (code) {
          if (code !== this.fetchVariablesCode) {
            this.fetchAll(sessionId)
          }
        }
      })

      this.myKernelSevice.sessionStore[sessionId].session.iopubMessage.connect((session, msg) => {
        if (KernelMessage.isExecuteInputMsg(msg)) {
          let executeInputMessage: KernelMessage.IExecuteInputMsg = msg
          this.sessionVariableStore[sessionId].executionCount.next(executeInputMessage.content.execution_count)
          this.sessionVariableStore[sessionId].lastCode.next(executeInputMessage.content.code)
        }
      })
    }
  }

  resetVariableService(sessionId: string) {
    this.sessionVariableStore[sessionId].timestamps.next({})
    this.sessionVariableStore[sessionId].variableStore.next({});
    this.sessionVariableStore[sessionId].oldVariableStore = {};
    this.sessionVariableStore[sessionId].variableComponentStore = {};
    this.sessionVariableStore[sessionId].variableIdentifierMap = {};
    this.sessionVariableStore[sessionId].variableEvaluateMap = {};
  }

  allVariablesInitilised(sessionId: string) {
    let initialiseHandlerCode = `${this.handlerName} = ${this.variableHandlerClass}("""${JSON.stringify(this.sessionVariableStore[sessionId].variableEvaluateMap)}""", "${this.handlerName}")`
    this.myKernelSevice.runCode(sessionId, initialiseHandlerCode, '"initialiseVariableHandler"')
    .then((future: Kernel.IFuture) => {
      future.done.then(() => {
        this.fetchAll(sessionId)
      })
    })    
  }

  appendToIdentifierMap(sessionId:string, variableIdentifier: string, variableName: string) {
    this.sessionVariableStore[sessionId].variableIdentifierMap[variableIdentifier] = variableName
  }

  appendToEvaluateMap(sessionId: string, variableName: string, variableEvaluate: string) {
    if (!(variableName in this.sessionVariableStore[sessionId].variableEvaluateMap)) {
      this.sessionVariableStore[sessionId].variableEvaluateMap[variableName] = variableEvaluate
    }
  }

  initialiseVariableComponent(sessionId: string, component: VariableComponent) {
    const variableIdentifier = component.variableIdentifier
    this.sessionVariableStore[sessionId].variableComponentStore[variableIdentifier] = component
    
    const variableEvaluate = component.pythonVariableEvaluate();
    const variableName = component.variableName;

    this.appendToIdentifierMap(sessionId, variableIdentifier, variableName);
    this.appendToEvaluateMap(sessionId, variableName, variableEvaluate);
  }

  convertToVariableStore(sessionId: string, textContent: string) {
    let result = JSON.parse(textContent)

    this.sessionVariableStore[sessionId].pythonVariables = result

    let newVariableStore: VariableStore = {}
    Object.entries(this.sessionVariableStore[sessionId].variableIdentifierMap).forEach(
      ([variableIdentifier, variableName]) => {
        newVariableStore[variableIdentifier] = result[variableName]
      }
    );
    this.sessionVariableStore[sessionId].variableStore.next(newVariableStore)
  }

  ifJsonString(string: string) {
    try {
      JSON.parse(string);
    } catch (err) {
        return false;
    }
    return true;
  }

  fetchAll(sessionId: string) {
    // let fetchComplete = new PromiseDelegate<void> ();
    this.myKernelSevice.runCode(
      sessionId, this.fetchVariablesCode, '"fetchAllVariables"')
    .then((future: Kernel.IFuture) => {
      if (future) {
        let textContent = '';
        future.onIOPub = (msg => {
          if (msg.content.text) {
            textContent = textContent.concat(String(msg.content.text))
            if (this.ifJsonString(textContent)) {
              this.convertToVariableStore(sessionId, textContent)
              this.checkForChanges(sessionId)
            } else {
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

  updateTimestamp(sessionId: string, identifier: string) {
    let timestamps = this.sessionVariableStore[sessionId].timestamps.getValue()
    timestamps[identifier] = Date.now()

    this.sessionVariableStore[sessionId].timestamps.next(timestamps)
  }

  variableHasChanged(sessionId: string, identifier: string) {
    this.updateComponentView(
      this.sessionVariableStore[sessionId].variableComponentStore[identifier], this.sessionVariableStore[sessionId].variableStore.getValue()[identifier].value)
    this.updateTimestamp(sessionId, identifier)
  }

  checkForChanges(sessionId: string) {
    const variableIdentifiers = Object.keys(this.sessionVariableStore[sessionId].variableComponentStore);

    for (let identifier of variableIdentifiers) {
      if (this.sessionVariableStore[sessionId].variableStore.getValue()[identifier].defined) {
        if (this.sessionVariableStore[sessionId].oldVariableStore) {
          if (stringify(this.sessionVariableStore[sessionId].variableStore.getValue()[identifier]) != stringify(this.sessionVariableStore[sessionId].oldVariableStore[identifier])) {
            this.variableHasChanged(sessionId, identifier)
          }
        } else {
          this.variableHasChanged(sessionId, identifier)
        } 
      }
    }
    let aVariableHasChanged = (stringify(this.sessionVariableStore[sessionId].variableStore.getValue()) != stringify(this.sessionVariableStore[sessionId].oldVariableStore));
    if (aVariableHasChanged) {
      console.log(this.sessionVariableStore[sessionId].variableStore.getValue())
      this.sessionVariableStore[sessionId].variableChangedObservable.next(this.sessionVariableStore[sessionId].variableStore.getValue())
    }
    this.sessionVariableStore[sessionId].oldVariableStore = JSON.parse(JSON.stringify(this.sessionVariableStore[sessionId].variableStore.getValue()));
  }

  pushVariable(sessionId: string, variableIdentifier: string, variableName: string, valueReference: string) {
    let pushCode = `${variableName} = ${valueReference}`

    this.updateTimestamp(sessionId, variableIdentifier)
    
    this.sessionVariableStore[sessionId].oldVariableStore[variableIdentifier] = {
      defined: true,
      value: JSON.parse(JSON.stringify(valueReference))
    }

    return this.myKernelSevice.runCode(
      sessionId, pushCode, '"push"_"' + variableIdentifier + '"'
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
