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
  Component, AfterViewInit, Input
} from '@angular/core';

import { VariableBaseComponent } from './variable-base.component';

@Component({})
export class NumberBaseComponent extends VariableBaseComponent implements AfterViewInit { 
  @Input() min?: number = null;
  @Input() max?: number = null;
  @Input() step?: number = 1;

  usedSeparator: boolean = false;

  // variableValue: number

  loadVariableName() {
    let element: HTMLSpanElement = this.variablecontainer.nativeElement
    const ngContent = this.htmlDecode(element.innerHTML).trim();

    // Make both , and ; work for now, remove this in version 0.8.0.
    const items = ngContent.split(/[,;]/)
    if (items.length > 1) {
      this.usedSeparator = true;
    }

    // console.log(items)

    this.variableName = items[0].trim()

    if (items.length > 1) {
      this.min = Number(items[1])
    }

    if (items.length > 2) {
      this.max = Number(items[2])
    }

    if (items.length > 3) {
      this.step = Number(items[3])
    }
  }
}