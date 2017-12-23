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

/*
The root form component.

Passes the jupyterlab session into the kernel service and connects. Passes
through the `setFormContents` function.
*/

import {
  Component, ViewChild
} from '@angular/core';

import { FormBuilderComponent } from './form-builder-module/form-builder.component';
import { KernelService } from './services/kernel.service';
import { JupyterlabModelService } from './services/jupyterlab-model.service';

import {
  ServiceManager
} from '@jupyterlab/services';

import {
  FormModel
} from '../jupyterlab-extension/model';

@Component({
  selector: 'app-root',
  template: `<div class="margin"><app-form-builder #form></app-form-builder></div>`,
  styles: [`.margin { margin: 20px;}`]
})
export class AppComponent {
  @ViewChild('form') formBuilderComponent: FormBuilderComponent;

  constructor(
    private myKernelService: KernelService,
    private myJupyterlabModelService: JupyterlabModelService
  ) { }

  /**
   * Set or update the template of the form.
   * 
   * @param template: The template to set the form with
   */
  public setTemplateAndBuildForm(template: string) {
    this.myJupyterlabModelService.setTemplate(template);
    this.formBuilderComponent.buildForm();
  }

  public setDocumentModel(model: FormModel) {
    this.myJupyterlabModelService.setModel(model);
  }

  public modelReady(): Promise<void> {
    return this.myJupyterlabModelService.modelReady.promise;
  }

  /**
   * Given a Jupyterlab session manager either reconnect to existing kernel
   * or start a new kernel at the provided path.
   * 
   * @param services: The jupyterlab service manager.
   * @param path: The kernel session filepath.
   */
  public sessionConnect(services: ServiceManager, path: string) {
    this.myKernelService.setServices(services);
    this.myKernelService.setPath(path);
    this.myKernelService.sessionConnect();
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
