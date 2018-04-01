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
The root form component.

Passes the jupyterlab session into the kernel service and connects. Passes
through the `setFormContents` function.
*/

import {
  Component, ViewChild, AfterViewInit, ElementRef
} from '@angular/core';

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

import { IScriptedForms, InitialisationService } from './services/initialisation.service';
import { FormService } from './services/form.service';
import { KernelService } from './services/kernel.service';
import { VariableService } from './services/variable.service';
import { FileService } from './services/file.service';

import { FormStatus } from './types/form-status';


@Component({
  selector: 'app-root',
  template: `
<div class="margin">
  <div class="hide-on-print">
    <toolbar-base></toolbar-base>
    <mat-progress-spinner
      color="accent"
      *ngIf="kernelStatus !== 'idle' || formStatus !== 'ready' || variableStatus !== 'idle' || queueLength !== 0"
      class="floating-spinner"
      mode="indeterminate">
    </mat-progress-spinner>
  </div>
  <app-form-builder #formBuilderComponent><div #jupyterErrorMsg></div></app-form-builder>
  <div class="footer-space"></div>
</div>`
})
export class AppComponent implements AfterViewInit {
  kernelStatus: Kernel.Status = 'unknown';
  formStatus: FormStatus = null;
  variableStatus: string = null;
  queueLength: number = null;

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
    this.myFormService.formBuilderComponent = this.formBuilderComponent;

    const rendermime = new RenderMimeRegistry({ initialFactories });

    this.myKernelSevice.jupyterError.subscribe(msg => {
      if (msg !== null) {
        const msgType = msg.header.msg_type;
        const model = new OutputAreaModel();
        const output = msg.content as nbformat.IOutput;
        output.output_type = msgType as nbformat.OutputType;
        model.add(output);

        const outputArea = new OutputArea({ model, rendermime });

        const errorDiv: HTMLDivElement = this.jupyterErrorMsg.nativeElement;

        const errorHeading = document.createElement('h2');
        errorHeading.innerText = 'Python Error:';
        const errorParagraph = document.createElement('p');
        errorParagraph.innerText = (
          'A Python error has occured. This could be due to an error within ' +
          'your ScriptedForms template or an issue with ScriptedForms itself.'
        );
        const errorParagraphAfter = document.createElement('p');
        errorParagraphAfter.innerText = (
          'This error message will not go away until after a page refresh.'
        );

        errorDiv.appendChild(errorHeading);
        errorDiv.appendChild(errorParagraph);
        errorDiv.appendChild(outputArea.node);
        errorDiv.appendChild(errorParagraphAfter);
      }
    });

    this.myFormService.formStatus.subscribe(status => {
      console.log('form: ' + status);
      this.formStatus = status;
    });

    this.myVariableService.variableStatus.subscribe(status => {
      console.log('variable: ' + status);
      this.variableStatus = status;
    });

    this.myKernelSevice.kernelStatus.subscribe(status => {
      console.log('kernel: ' + status);
      this.kernelStatus = status;
    });

    this.myKernelSevice.queueLength.subscribe(length => {
      console.log('queue-length: ' + length);
      this.queueLength = length;
    });
  }

  public initiliseScriptedForms(options: IScriptedForms.IOptions) {
    this.myInitialisationService.initiliseScriptedForms(options);
  }

  public initiliseBaseScriptedForms(options: IScriptedForms.IOptions) {
    this.myInitialisationService.initiliseBaseScriptedForms(options);
  }

  public setTemplateToString(dummyPath: string, template: string) {
    this.myFileService.setTemplateToString(dummyPath, template);
  }
}
