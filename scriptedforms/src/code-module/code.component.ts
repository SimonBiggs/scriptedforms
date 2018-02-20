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
  selector: 'code.language-python',
  template: `<span #codecontainer [hidden]="this.name !== undefined"><ng-content></ng-content></span>`
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
  outputContainer: HTMLDivElement

  @Output() aCodeRunCompleted = new EventEmitter();

  code: string;
  @ViewChild('codecontainer') codecontainer: ElementRef;

  constructor(
    private myKernelSevice: KernelService,
    private myFileService: FileService,
    private _eRef: ElementRef
  ) { }

  ngAfterViewInit() {
    this.code = this.codecontainer.nativeElement.innerText;

    // Apply python syntax highlighting to every code block
    Mode.ensure('python').then((spec) => {
      const el = document.createElement('div');
      Mode.run(this.code, spec.mime, el);
      this.codecontainer.nativeElement.innerHTML = el.innerHTML;
      this._eRef.nativeElement.classList.add('cm-s-jupyter');
    });

    // Initialise a JupyterLab output area
    this.model = new OutputAreaModel();
    this.renderMime = new RenderMimeRegistry({ initialFactories });

    this.outputAreaOptions = {
      model: this.model,
      rendermime: this.renderMime
    };

    this.outputArea = new OutputArea(this.outputAreaOptions);
    let element: HTMLElement = this._eRef.nativeElement
    this.outputContainer = document.createElement("div")
    this.outputContainer.appendChild(this.outputArea.node)
    element.parentNode.parentNode.insertBefore(this.outputContainer, element.parentNode)

    // Make any output area changes send a message to the Output Service
    // for the purpose of saving the output to the model
    this.aCodeRunCompleted.subscribe(() => {
      // when model is implemented shouldn't actually change to json, no need.
      // JSON.stringify(this.outputArea.model.toJSON());
      // this.myOutputService.setOutput(this.name, this.outputArea.model);
      this.outputArea.future.done.then(() => {
        let links: HTMLAnchorElement[] = Array.from(this.outputContainer.getElementsByTagName("a"))
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
        this.aCodeRunCompleted.emit();

        this.future.done.then(() => {
          let element: HTMLDivElement = this.outputContainer
          element.style.minHeight = String(this.outputArea.node.clientHeight) + 'px'
        })
      }
    });
  }

  hideOutput() {
    this.future = undefined
    this.outputArea.hide()
  }


}
