// scriptedforms
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compiance with both the Apache-2.0 AND 
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
The root form component.

Passes the jupyterlab session into the kernel service and connects. Passes
through the `setFormContents` function.
*/

import {
  Component, ViewChild
} from '@angular/core';

// import {
//   Kernel
// } from '@jupyterlab/services';

import { FormBuilderComponent } from './form-builder-module/form-builder.component';
import { KernelService } from './services/kernel.service';
import { ModelService } from './services/model.service';

import {
  SessionConnectOptions
} from './interfaces/session-connect-options';

@Component({
  selector: 'app-root',
  template: `<div class="margin"><app-form-builder #form></app-form-builder></div>`,
  styles: [`.margin { margin: 20px;}`]
})
export class AppComponent {
  @ViewChild('form') formBuilderComponent: FormBuilderComponent;

  constructor(
    private myKernelService: KernelService,
    private myModelService: ModelService
  ) { }

  /**
   * Set or update the template of the form.
   * 
   * @param template: The template to set the form with
   */
  public setTemplateAndBuildForm(template: string): Promise<void> {
    this.myModelService.setTemplate(template);
    return this.formBuilderComponent.buildForm();
  }

  public modelReady(): Promise<void> {
    return this.myModelService.modelReady.promise;
  }

  /**
   * Given a Jupyterlab session manager either reconnect to existing kernel
   * or start a new kernel at the provided path.
   */
  public sessionConnect(options: SessionConnectOptions) {
    this.myKernelService.sessionConnect(options);
  }

  /**
   * Inform the kernel service that its path has changed.
   * 
   * @param path: The kernel session filepath.
   */
  public pathChanged(path: string) {
    this.myKernelService.pathChanged(path);
  }
}
