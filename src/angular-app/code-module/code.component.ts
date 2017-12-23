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

import { RenderMime, defaultRendererFactories } from '@jupyterlab/rendermime';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import { Kernel } from '@jupyterlab/services';

import {
  Mode
} from '@jupyterlab/codemirror';

import { KernelService } from '../services/kernel.service';
import { OutputService } from '../services/output.service';

@Component({
  // By using the selector 'code' this overwrites the standard <code> html tag.
  selector: 'code',
  template: `
<span #outputcontainer></span>
<span #codecontainer [hidden]="future != undefined"><ng-content></ng-content></span>`
})
export class CodeComponent implements AfterViewInit, OnDestroy {
  name: string;
  renderMimeOptions: RenderMime.IOptions;
  renderMime: RenderMime;
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
    private myOutputService: OutputService,
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
      this._eRef.nativeElement.classList.add('language-python');
    });

    // Initialise a JupyterLab output area
    this.model = new OutputAreaModel();
    this.renderMime = new RenderMime({
      initialFactories: defaultRendererFactories
    });

    this.outputAreaOptions = {
      model: this.model,
      rendermime: this.renderMime
    };

    this.outputArea = new OutputArea(this.outputAreaOptions);

    // Make any output area changes send a message to the Output Service
    // for the purpose of saving the output to the model
    this.outputArea.model.changed.connect(() => {
      // when model is implemented shouldn't actually change to json, no need.
      JSON.stringify(this.outputArea.model.toJSON());
      this.myOutputService.setOutput(this.name, this.outputArea.model);
    });
  }

  ngOnDestroy() {
    this.outputArea.dispose();
  }

  /**
   * Each runnable code component on the form has a unique name. This is defined by
   * it's parent section. The name is used to detect repeat submissions for the purpose
   * of only running the most recent submission.
   *  
   * @param name A unique name for the code component
   */
  setName(name: string) {
    this.name = name;
  }

  /**
   * Run the code within the code component. Update the output area with the results of the 
   * code.
   */
  runCode() {
    this.promise = this.myKernelSevice.runCode(this.code, this.name);
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
