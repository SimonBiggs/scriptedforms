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

import { VariableBaseComponent } from './variable-base.component';

import {
  Component, AfterViewInit
} from '@angular/core';

@Component({})
export class BooleanBaseComponent extends VariableBaseComponent implements AfterViewInit { 
  variableValue: boolean;
  updateVariableView(value: string) {
    if (value === 'True') {
      this.variableValue = true
    } else if (value === 'False') {
      this.variableValue = false
    } else {
      RangeError("Unexpected boolean response")
    }
    this.updateOldVariable()
  }

  pythonValueReference() {
    let valueReference: string;
    if (this.variableValue) {
      valueReference = 'True'
    } else {
      valueReference = 'False'
    }

    return valueReference
  }
}