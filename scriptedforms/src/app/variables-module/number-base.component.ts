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


import {
  Component, AfterViewInit, Input
} from '@angular/core';

import { VariableBaseComponent } from './variable-base.component';

@Component({
  template: ''
})
export class NumberBaseComponent extends VariableBaseComponent implements AfterViewInit {
  @Input() min?: number = null;
  @Input() max?: number = null;
  @Input() step ? = 1;

  usedSeparator = false;

  // variableValue: number

  loadVariableName() {
    const element: HTMLSpanElement = this.variablecontainer.nativeElement;
    const ngContent = this.htmlDecode(element.innerHTML).trim();

    // Make both , and ; work for now, remove this in version 0.8.0.
    const items = ngContent.split(/[,;]/);
    if (items.length > 1) {
      this.usedSeparator = true;
    }

    this.variableName = items[0].trim();

    if (items.length > 1) {
      this.min = Number(items[1]);
    }

    if (items.length > 2) {
      this.max = Number(items[2]);
    }

    if (items.length > 3) {
      this.step = Number(items[3]);
    }
  }
}
