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
A component that clobbers the html <code> tags.

Markdown turns the following syntax into <code> tags:
```
code here
```

This component highjacks those tags, reads the text written within them and
preps the code for sending to the Python kernel.

The function 'runCode' can be called on this component to have its code sent
to the Python kernel.
*/

import {
  Component, AfterViewInit, ViewChild, ElementRef, OnDestroy, EventEmitter,
  Output
} from '@angular/core';

// import {
//   Observable
// } from 'rxjs/Observable';

import {
  RenderMimeRegistry, standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import { Kernel } from '@jupyterlab/services';

import {
  Mode
} from '@jupyterlab/codemirror';

import { KernelService } from '../services/kernel.service';
import { FileService } from '../services/file.service';

@Component({
  // By using the selector 'code' this overwrites the standard <code> html tag.
  selector: 'code',
  // Changed [hidden]="future != undefined" --> [hidden]="True" for code to be hidden by default
  template: `<span class="output-container" #outputcontainer></span><span #codecontainer [hidden]="this.name !== undefined"><ng-content></ng-content></span>`
})
export class CodeComponent implements AfterViewInit, OnDestroy {
  sessionId: string;
  name: string;
  renderMimeOptions: RenderMimeRegistry.IOptions;
  renderMime: RenderMimeRegistry;
  model: OutputAreaModel;
  outputAreaOptions: OutputArea.IOptions;
  outputArea: OutputArea;

  promise: Promise<Kernel.IFuture>;
  future: Kernel.IFuture;

  @Output() aCodeRunCompleted = new EventEmitter();

  code: string;
  @ViewChild('codecontainer') codecontainer: ElementRef;
  @ViewChild('outputcontainer') outputcontainer: ElementRef;

  constructor(
    private myKernelSevice: KernelService,
    // private myOutputService: OutputService,
    private myFileService: FileService,
    private _eRef: ElementRef
  ) { }

  ngAfterViewInit() {
    // Assign the text within <code> to the this.code variable
    this.code = this.codecontainer.nativeElement.innerText;

    // Apply python syntax highlighting to every code block
    Mode.ensure('python').then((spec) => {
      const el = document.createElement('div');
      Mode.run(this.code, spec.mime, el);
      this.codecontainer.nativeElement.innerHTML = el.innerHTML;
      this._eRef.nativeElement.classList.add('cm-s-jupyter');
      // this._eRef.nativeElement.classList.add('language-python');
    });

    // Initialise a JupyterLab output area
    this.model = new OutputAreaModel();
    this.renderMime = new RenderMimeRegistry({ initialFactories });

    this.outputAreaOptions = {
      model: this.model,
      rendermime: this.renderMime
    };

    this.outputArea = new OutputArea(this.outputAreaOptions);

    // Make any output area changes send a message to the Output Service
    // for the purpose of saving the output to the model
    this.aCodeRunCompleted.subscribe(() => {
      // when model is implemented shouldn't actually change to json, no need.
      // JSON.stringify(this.outputArea.model.toJSON());
      // this.myOutputService.setOutput(this.name, this.outputArea.model);
      this.outputArea.future.done.then(() => {
        let links: HTMLAnchorElement[] = Array.from(this.outputcontainer.nativeElement.getElementsByTagName("a"))
        this.myFileService.morphLinksToUpdateFile(links);
      })
    });
  }

  ngOnDestroy() {
    // this.outputArea.dispose();
  }

  /**
   * Each runnable code component on the form has a unique name. This is defined by
   * it's parent section. The name is used to detect repeat submissions for the purpose
   * of only running the most recent submission.
   *  
   * @param name A unique name for the code component
   */
  // codeComponentInit(sessionId: string, name: string) {
  //   this.name = name;
  //   this.sessionId = sessionId
  // }

  /**
   * Run the code within the code component. Update the output area with the results of the 
   * code.
   */
  runCode() {
    this.promise = this.myKernelSevice.runCode(this.sessionId, this.code, this.name);
    this.promise.then(future => {
      if (future) {
        this.future = future;
        this.outputArea.show()
        this.outputArea.future = this.future;
        this.outputcontainer.nativeElement.appendChild(this.outputArea.node);
        this.aCodeRunCompleted.emit();
      }
    });
  }

  hideOutput() {
    this.future = undefined
    this.outputArea.hide()

    console.log(this.future)
  }


}
