// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.


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
  Component, AfterViewInit, ViewChild, ElementRef, OnDestroy
} from '@angular/core';

// import {
//   Observable
// } from 'rxjs/Observable';

import {
  JSONObject
} from '@phosphor/coreutils';

import {
  nbformat
} from '@jupyterlab/coreutils';

import {
  RenderMimeRegistry, standardRendererFactories as initialFactories
} from '@jupyterlab/rendermime';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import { Kernel, KernelMessage } from '@jupyterlab/services';

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
  private _displayIdMap = new Map<string, number[]>();
  sessionId: string;
  name: string;
  renderMime: RenderMimeRegistry = new RenderMimeRegistry({
    initialFactories,
    sanitizer: {
      sanitize: (input: string) => {return input}
    }
  });
  model: OutputAreaModel = new OutputAreaModel();
  outputAreaOptions: OutputArea.IOptions = {
    model: this.model,
    rendermime: this.renderMime
  };
  outputArea: OutputArea = new OutputArea(this.outputAreaOptions);

  promise: Promise<Kernel.IFuture>;
  outputContainer: HTMLDivElement;

  mutationObserver: MutationObserver;

  code: string;
  @ViewChild('codecontainer') codecontainer: ElementRef;

  constructor(
    private myKernelSevice: KernelService,
    private myFileService: FileService,
    private _eRef: ElementRef
  ) { }

  updateOutputAreaModel() {
    this.outputAreaOptions = {
      model: this.model,
      rendermime: this.renderMime
    };
    this.outputArea = new OutputArea(this.outputAreaOptions);
  }

  ngAfterViewInit() {
    this.code = this.codecontainer.nativeElement.innerText;

    // Apply python syntax highlighting to every code block
    Mode.ensure('python').then((spec) => {
      const el = document.createElement('div');
      Mode.run(this.code, spec.mime, el);
      this.codecontainer.nativeElement.innerHTML = el.innerHTML;
      this._eRef.nativeElement.classList.add('cm-s-jupyter');
    });

    let element: HTMLElement = this._eRef.nativeElement
    this.outputContainer = document.createElement("div")
    this.outputContainer.appendChild(this.outputArea.node)
    element.parentNode.parentNode.insertBefore(this.outputContainer, element.parentNode)

    // Mutation observer is awesome! Use more of this.
    this.mutationObserver = new MutationObserver(() => {
      let links: HTMLAnchorElement[] = Array.from(this.outputContainer.getElementsByTagName("a"))
      this.myFileService.morphLinksToUpdateFile(links);
    })

    this.mutationObserver.observe(
      this.outputContainer, 
      {
        childList: true,
        subtree: true
      }
    )
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
        this.model = new OutputAreaModel()

        future.onIOPub = this._onIOPub

        future.done.then(() => {
          this.updateOutputAreaModel()

          this.outputContainer.replaceChild(this.outputArea.node, this.outputContainer.firstChild)

          let element: HTMLDivElement = this.outputContainer
          element.style.minHeight = String(this.outputArea.node.clientHeight) + 'px'
        })
      }
    });
  }

  // Extract from @jupyterlab/outputarea/src/widget.ts
  private _onIOPub = (msg: KernelMessage.IIOPubMessage) => {
    let model = this.model;
    let msgType = msg.header.msg_type;
    let output: nbformat.IOutput;
    let transient = (msg.content.transient || {}) as JSONObject;
    let displayId = transient['display_id'] as string;
    let targets: number[];

    switch (msgType) {
    case 'execute_result':
    case 'display_data':
    case 'stream':
    case 'error':
      output = msg.content as nbformat.IOutput;
      output.output_type = msgType as nbformat.OutputType;
      model.add(output);
      break;
    case 'clear_output':
      let wait = (msg as KernelMessage.IClearOutputMsg).content.wait;
      model.clear(wait);
      break;
    case 'update_display_data':
      output = msg.content as nbformat.IOutput;
      output.output_type = 'display_data';
      targets = this._displayIdMap.get(displayId);
      if (targets) {
        for (let index of targets) {
          model.set(index, output);
        }
      }
      break;
    default:
      break;
    }
    if (displayId && msgType === 'display_data') {
       targets = this._displayIdMap.get(displayId) || [];
       targets.push(model.length - 1);
       this._displayIdMap.set(displayId, targets);
    }
  }
}
