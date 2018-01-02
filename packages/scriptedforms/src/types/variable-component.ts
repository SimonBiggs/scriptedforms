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

import { TickComponent } from '../variables-module/tick.component';
import { ToggleComponent } from '../variables-module/toggle.component';
import { ConditionalComponent } from '../variables-module/conditional.component';

import { NumberComponent } from '../variables-module/number.component';
import { SliderComponent } from '../variables-module/slider.component';
import { TableComponent } from '../variables-module/table.component';

import { StringComponent } from '../variables-module/string.component';
import { DropdownComponent } from '../variables-module/dropdown.component';
import { PasswordComponent } from '../variables-module/password.component';

export type VariableComponent = NumberComponent | StringComponent | TableComponent | TickComponent | ToggleComponent | SliderComponent | DropdownComponent | ConditionalComponent | PasswordComponent