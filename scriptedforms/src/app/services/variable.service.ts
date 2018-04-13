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

/*
This will eventually be how the variables are saved.

Not yet implemented.
*/

import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

// import { Slot } from '@phosphor/signaling';
import { PromiseDelegate } from '@phosphor/coreutils';

import { Kernel, KernelMessage } from '@jupyterlab/services';
import { nbformat } from '@jupyterlab/coreutils';

import * as  stringify from 'json-stable-stringify';
import * as uuid from 'uuid';

import { Injectable } from '@angular/core';
import { KernelService } from './kernel.service';
// import { FileService } from './file.service';

import { VariableStore } from '../interfaces/variable-store';
import { VariableValue } from '../types/variable-value';

import { VariableComponent } from '../types/variable-component';


@Injectable()
export class VariableService {
  variableHandlerClass = '_VariableHandler';
  handlerName = '_scriptedforms_variable_handler';
  fetchVariablesCode = `exec(${this.handlerName}.fetch_code)`;

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
  variableComponentStore: {
    [key: string]: VariableComponent
  };
  executionCount: BehaviorSubject<nbformat.ExecutionCount>;
  lastCode: BehaviorSubject<string>;
  variableChangeSubscription: Subscription;

  variableStatus: BehaviorSubject<string> = new BehaviorSubject(null);

  variableHandlerInitialised = false;

  constructor(
    private myKernelSevice: KernelService
  ) { }

  variableInitialisation() {
    this.variableStore = new BehaviorSubject({});
    this.oldVariableStore = null;
    this.variableIdentifierMap = {};
    this.variableEvaluateMap = {};
    this.pythonVariables = {};
    this.variableChangedObservable = new BehaviorSubject(null);
    this.variableComponentStore = {};
    this.executionCount = new BehaviorSubject(null);
    this.lastCode = new BehaviorSubject(null);
    this.variableChangeSubscription = null;

    this.myKernelSevice.session.iopubMessage.connect((session, msg) => {
      if (KernelMessage.isExecuteInputMsg(msg)) {
        const executeInputMessage: KernelMessage.IExecuteInputMsg = msg;
        this.executionCount.next(executeInputMessage.content.execution_count);
        this.lastCode.next(executeInputMessage.content.code);
      }
    });
  }

  startListeningForChanges() {
    this.variableChangeSubscription = (
      this.lastCode.subscribe(code => {
        if (this.variableHandlerInitialised) {
          if (code) {
            const commentRemovedCode = code.replace(/^#.*\n/, '');
            if (commentRemovedCode !== this.fetchVariablesCode) {
              this.fetchAll();
            }
          }
        }
      })
    );
  }

  resetVariableService() {
    this.variableHandlerInitialised = false;
    if (this.variableChangeSubscription) {
      this.variableChangeSubscription.unsubscribe();
    }
    this.variableStatus.next('reset');
    this.variableStore.next({});
    this.oldVariableStore = {};
    this.variableComponentStore = {};
    this.variableIdentifierMap = {};
    this.variableEvaluateMap = {};
  }

  allVariablesInitilised() {
    const initilisationComplete = new PromiseDelegate<void>();
    this.variableStatus.next('initialising');
    const jsonEvaluateMap = JSON.stringify(this.variableEvaluateMap);
    const initialiseHandlerCode = `${this.handlerName} = ${this.variableHandlerClass}("""${jsonEvaluateMap}""", "${this.handlerName}")`;
    this.myKernelSevice.runCode(initialiseHandlerCode, '"initialiseVariableHandler"')
    .then((future: Kernel.IFuture) => {
      if (future) {
        future.done.then(() => {
          initilisationComplete.resolve(null);
          this.variableHandlerInitialised = true;
          this.fetchAll();
        });
      } else {
        console.log('No future returned from initialiseVariableHandler');
      }
    });

    return initilisationComplete.promise;
  }

  appendToIdentifierMap(variableIdentifier: string, variableName: string) {
    this.variableIdentifierMap[variableIdentifier] = variableName;
  }

  appendToEvaluateMap(variableName: string, variableEvaluate: string) {
    if (!(variableName in this.variableEvaluateMap)) {
      this.variableEvaluateMap[variableName] = variableEvaluate;
    }
  }

  initialiseVariableComponent(component: VariableComponent) {
    const variableIdentifier = component.variableIdentifier;
    this.variableComponentStore[variableIdentifier] = component;

    const variableEvaluate = component.pythonVariableEvaluate();
    const variableName = component.variableName;

    this.appendToIdentifierMap(variableIdentifier, variableName);
    this.appendToEvaluateMap(variableName, variableEvaluate);
  }

  convertToVariableStore(textContent: string) {
    const result = JSON.parse(textContent);

    this.pythonVariables = result;

    const newVariableStore: VariableStore = {};
    Object.entries(this.variableIdentifierMap).forEach(
      ([variableIdentifier, variableName]) => {
        newVariableStore[variableIdentifier] = result[variableName];
      }
    );
    this.variableStore.next(newVariableStore);
  }

  ifJsonString(string: string) {
    try {
      JSON.parse(string);
    } catch (err) {
        return false;
    }
    return true;
  }

  fetchAll(label = '"fetchAllVariables"') {
    if (!this.variableHandlerInitialised) {
      console.log('fetch called before ready');
      return Promise.resolve(null);
    }
    this.variableStatus.next('fetching');
    const fetchComplete = new PromiseDelegate<void> ();
    this.myKernelSevice.runCode(this.fetchVariablesCode, label)
    .then((future: Kernel.IFuture) => {
      if (future) {
        let textContent = '';
        future.onIOPub = (msg => {
          if (msg.content.text) {
            textContent = textContent.concat(String(msg.content.text));
            if (this.ifJsonString(textContent)) {
              this.convertToVariableStore(textContent);
              this.checkForChanges();
            }
          }
        });
        future.done.then(() => {
          fetchComplete.resolve(null);
        });
      }
    });

    return fetchComplete.promise;
  }

  updateComponentView(component: any, value: VariableValue) {
    component.updateVariableView(JSON.parse(JSON.stringify(value)));
  }

  variableHasChanged(identifier: string) {
    this.updateComponentView(
      this.variableComponentStore[identifier],
      this.variableStore.getValue()[identifier].value);
  }

  checkForChanges() {
    this.variableStatus.next('checking-for-changes');
    const variableIdentifiers = Object.keys(this.variableComponentStore);

    for (const identifier of variableIdentifiers) {
      if (this.variableStore.getValue()[identifier].defined) {
        if (this.oldVariableStore) {
          if (
            stringify(this.variableStore.getValue()[identifier]) !==
            stringify(this.oldVariableStore[identifier])
          ) {
            this.variableHasChanged(identifier);
          }
        } else {
          this.variableHasChanged(identifier);
        }
      }
    }
    const aVariableHasChanged = (
      stringify(this.variableStore.getValue()) !==
      stringify(this.oldVariableStore)
    );
    if (aVariableHasChanged) {
      this.variableChangedObservable.next(this.variableStore.getValue());
      this.variableStatus.next('a-change-was-made');
    } else {
      this.variableStatus.next('no-change-was-made');
    }

    const id = uuid.v4();
    const staticStatus = 'prepping-for-idle: ' + id;
    this.variableStatus.next(staticStatus);
    this.myKernelSevice.queue.then(() => {
      if (this.variableStatus.getValue() === staticStatus) {
        this.variableStatus.next('idle');
      }
    });
    this.oldVariableStore = JSON.parse(
      JSON.stringify(this.variableStore.getValue())
    );
  }

  pushVariable(variableIdentifier: string, variableName: string, valueReference: string) {
    const pushCode = `${variableName} = ${valueReference}`;

    this.oldVariableStore[variableIdentifier] = {
      defined: true,
      value: JSON.parse(JSON.stringify(valueReference))
    };

    return this.myKernelSevice.runCode(
      pushCode, '"push"_"' + variableIdentifier + '"'
    ).then(future => {
      if (future) {
        const promise = future.done;
        return promise;
      } else {
        return Promise.resolve('ignore');
      }
    });
  }
}
