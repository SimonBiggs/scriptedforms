/*
 *  Copyright 2017 Simon Biggs
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


import {
  Component, ViewChild, AfterViewInit, ElementRef,
  ChangeDetectorRef
} from '@angular/core';

import {
  nbformat
} from '@jupyterlab/coreutils';
import {
  RenderMimeRegistry, standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';

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


/*
 *  # Create your own Angular JupyterLab extension (cont.)
 *
 *  This is part of the guide available at
 *  <https://github.com/SimonBiggs/scriptedforms/blob/master/scriptedforms/docs/create-your-own-angular-jupyterlab-extension.md>
 *
 *  ## The Root Angular App Component
 *
 *  There's a lot going on in this file, but the greater majority of its content
 *  is ScriptedForms specific. There are only two things you will need from this
 *  file.
 *
 *  The first is how the template is defined. The key part is the 'html-loader!'.
 *  JupyterLab does not have a webpack method for loading up Angular templates.
 *  This loader text tells the JupyterLab webpack that it needs to use the html-loader.
 *  So that typescript doesn't complain about this import a module type needs
 *  to be defined. This is done in [component-html.d.ts](../component-html.d.ts).
 *
 *  The last feature that is worth noting are the public functions provided at
 *  the bottom of AppComponent such as `initiliseScriptedForms`.
 *  These functions are passed up to the Phosphor Widget
 *  and are called using the AngularWidget run() function.
 */


// JupyterLab doesn't have custom webpack loaders. Need to be able to
// inline the loaders so that they get picked up without having access to the
// webpack.config.js file
// See https://github.com/jupyterlab/jupyterlab/pull/4334#issuecomment-383104318
import * as htmlTemplate from 'html-loader!./app.component.html';

// This is currently needed to silence the angular-language-service not finding
// a template for this component.
// See https://github.com/angular/angular/issues/23478
const linterWorkaroundHtmlTemplate = '' + htmlTemplate;

@Component({
  selector: 'app-root',
  template: linterWorkaroundHtmlTemplate
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
    private myVariableService: VariableService,
    private myChangeDetectorRef: ChangeDetectorRef
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
      this.myChangeDetectorRef.detectChanges();
    });

    this.myVariableService.variableStatus.subscribe(status => {
      console.log('variable: ' + status);
      this.variableStatus = status;
      this.myChangeDetectorRef.detectChanges();
    });

    this.myKernelSevice.kernelStatus.subscribe(status => {
      console.log('kernel: ' + status);
      this.kernelStatus = status;
      this.myChangeDetectorRef.detectChanges();
    });

    this.myKernelSevice.queueLength.subscribe(length => {
      console.log('queue-length: ' + length);
      this.queueLength = length;
      this.myChangeDetectorRef.detectChanges();
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
