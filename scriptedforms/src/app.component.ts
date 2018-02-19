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
The root form component.

Passes the jupyterlab session into the kernel service and connects. Passes
through the `setFormContents` function.
*/

import {
  Component, ViewChild, AfterViewInit, ElementRef
} from "@angular/core";

import {
  nbformat
} from '@jupyterlab/coreutils';
import {
  RenderMimeRegistry, standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';

// import { kernelIdleDebounce } from './levelled-files/level-1/kernel-idle-debounce';

import {
  Kernel
} from '@jupyterlab/services';

import { FormBuilderComponent } from './form-builder-module/form-builder.component';

import { IScriptedForms, InitialisationService } from './services/initialisation.service'
import { FileService } from "./services/file.service";
import { FormService } from "./services/form.service";
import { KernelService } from './services/kernel.service';
import { VariableService } from './services/variable.service';

import { FormStatus } from './types/form-status';

@Component({
  selector: "app-root",
  template: `
<div class="margin">
  <mat-progress-spinner color="accent" *ngIf="kernelStatus !== 'idle' || formStatus !== 'ready' || variableStatus !== 'idle'" class="floating-spinner" mode="indeterminate"></mat-progress-spinner>
  <div #jupyterErrorMsg></div>
  <app-form-builder #formBuilderComponent></app-form-builder>
  <button class="floating-restart-kernel" mat-fab (click)="restartKernel()" [disabled]="restartingKernel">
    <mat-icon>replay</mat-icon>
  </button>
  <div class="footer-space"></div>
</div>`,
  styles: [`.margin { margin: 20px;}`]
})
export class AppComponent implements AfterViewInit {
  restartingKernel = false;
  kernelStatus: Kernel.Status = 'unknown'
  formStatus: FormStatus = null
  variableStatus: string = null

  @ViewChild('formBuilderComponent') formBuilderComponent: FormBuilderComponent;
  @ViewChild('jupyterErrorMsg') jupyterErrorMsg: ElementRef;

  constructor(
    private myFileService: FileService,
    private myFormService: FormService,
    private myInitialisationService: InitialisationService,
    private myKernelSevice: KernelService,
    private myVariableService: VariableService

  ) {}

  ngAfterViewInit() {
    this.myFormService.formBuilderComponent = this.formBuilderComponent

    const rendermime = new RenderMimeRegistry({ initialFactories });

    this.myKernelSevice.jupyterError.subscribe(msg => {
      if (msg !== null) {
        let msgType = msg.header.msg_type;
        let model = new OutputAreaModel();
        let output = msg.content as nbformat.IOutput;
        output.output_type = msgType as nbformat.OutputType;
        model.add(output);
  
        let outputArea = new OutputArea({ model, rendermime });
  
        let errorDiv: HTMLDivElement = this.jupyterErrorMsg.nativeElement
        
        let errorNotice = document.createElement("h2")
        errorNotice.innerText = "An error occured within Python:"
        errorDiv.appendChild(errorNotice)
        errorDiv.appendChild(outputArea.node)
      }
    })

    this.myFormService.formStatus.subscribe(status => {
      console.log('form: ' + status)
      this.formStatus = status
    })

    this.myVariableService.variableStatus.subscribe(status => {
      console.log('variable: ' + status)
      this.variableStatus = status
    })

    this.myKernelSevice.kernelStatus.subscribe(status => {
      console.log('kernel: ' + status)
      this.kernelStatus = status
    })

    // kernelIdleDebounce(this.myKernelSevice.jupyterStatus).subscribe(status => {
    //   this.kernelStatus = status
    //   console.log(status)
    // })
  }

  restartKernel() {
    this.restartingKernel = true
    this.myFormService.restartFormKernel().then(() => {
      this.restartingKernel = false
    })
  }

  public initiliseScriptedForms(options: IScriptedForms.IOptions) {
    this.myInitialisationService.initiliseScriptedForms(options)
  }

  // public updateFileContents(fileContents: string) {
  //   return this.myFileService.handleFileContents(fileContents);
  // }

  /**
   * Set or update the template of the form.
   *
   * @param template: The template to set the form with
   */
  // public setTemplateAndBuildForm(template: string): Promise<void> {
  //   this.myModelService.setTemplate(template);
  //   return this.formBuilderComponent.buildForm();
  // }

  // public modelReady(): Promise<void> {
  //   return this.myModelService.modelReady.promise;
  // }

  /**
   * Given a Jupyterlab session manager either reconnect to existing kernel
   * or start a new kernel at the provided path.
   */
  // public sessionConnect(options: SessionConnectOptions) {
  //   this.myKernelService.sessionConnect(options);
  // }

  /**
   * Inform the kernel service that its path has changed.
   *
   * @param path: The kernel session filepath.
   */
  public pathChanged(path: string) {
    this.myFileService.path.next(path);
  }
}
