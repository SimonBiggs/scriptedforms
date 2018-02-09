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




import {
  Component, ContentChildren, QueryList
} from '@angular/core';

import { VariableService } from '../services/variable.service';

import { CodeComponent } from '../code-module/code.component';

@Component({
  selector: 'section-output',
  template: `<ng-content></ng-content>`
})
export class OutputComponent {
  outputId: number;
  sessionId: string

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;

  constructor(
    private myVariableService: VariableService
  ) { }

  runCode() {
    this.codeComponents.toArray().forEach(codeComponent => {
      codeComponent.runCode();
    });
  }

  formReady() {
    this.myVariableService.sessionVariableStore[this.sessionId].variableChangedObservable.subscribe(() => {
      this.runCode();
    })
  }

  setId(id: number) {
    this.outputId = id;
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.codeComponentInit(
        this.sessionId, '"output"_' + String(this.outputId) + '_' + String(index));
    });
  }
}
