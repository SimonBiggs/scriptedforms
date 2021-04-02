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

import { TickComponent } from '../variables-module/tick.component';
import { ToggleComponent } from '../variables-module/toggle.component';
import { ConditionalComponent } from '../variables-module/conditional.component';

import { NumberComponent } from '../variables-module/number.component';
import { SliderComponent } from '../variables-module/slider.component';
import { VariableTableComponent } from '../variables-module/variable-table.component';

import { StringComponent } from '../variables-module/string.component';
import { DropdownComponent } from '../variables-module/dropdown.component';

import { VariableFileComponent } from '../variables-module/variable-file.component';

export type VariableComponent = (
  NumberComponent | StringComponent | VariableTableComponent | TickComponent |
  ToggleComponent | SliderComponent | DropdownComponent | ConditionalComponent | VariableFileComponent);
