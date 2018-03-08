import { Component, ViewChild, ElementRef } from '@angular/core';

import { nbformat } from '@jupyterlab/coreutils';
import {
  RenderMimeRegistry, standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';

import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';

import { FormBuilderComponent } from "../app/form-builder-module/form-builder.component";
import { IScriptedForms, InitialisationService } from '../app/services/initialisation.service'
import { FormService } from "../app/services/form.service";
import { KernelService } from '../app/services/kernel.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild('formBuilderComponent') formBuilderComponent: FormBuilderComponent;
  @ViewChild('jupyterErrorMsg') jupyterErrorMsg: ElementRef;

  constructor(
    private myFormService: FormService,
    private myInitialisationService: InitialisationService,
    private myKernelSevice: KernelService,

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
        
        let errorHeading = document.createElement("h2")
        errorHeading.innerText = "Python Error:"
        let errorParagraph = document.createElement("p")
        errorParagraph.innerText = (
          "A Python error has occured. This could be due to an error within " +
          "your ScriptedForms template or an issue with ScriptedForms itself."
        )
        let errorParagraphAfter = document.createElement("p")
        errorParagraphAfter.innerText = (
          "This error message will not go away until after a page refresh."
        )

        errorDiv.appendChild(errorHeading)
        errorDiv.appendChild(errorParagraph)
        errorDiv.appendChild(outputArea.node)
        errorDiv.appendChild(errorParagraphAfter)
      }
    })
  }

  public initiliseScriptedForms(options: IScriptedForms.IOptions) {
    this.myInitialisationService.initiliseScriptedForms(options)
  }
}
