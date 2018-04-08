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

// import { BehaviorSubject } from 'rxjs/BehaviorSubject';
// import { Subscription } from 'rxjs/Subscription';

import { Component, AfterViewInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';

import { JSONObject, PromiseDelegate } from '@phosphor/coreutils';

import { nbformat } from '@jupyterlab/coreutils';
import { RenderMimeRegistry, standardRendererFactories as initialFactories } from '@jupyterlab/rendermime';
import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
import { Kernel, KernelMessage } from '@jupyterlab/services';
import { Mode } from '@jupyterlab/codemirror';

import { KernelService } from '../services/kernel.service';

@Component({
  selector: 'code.language-python',
  template: `<span #codecontainer [hidden]="this.name !== undefined"><ng-content></ng-content></span>`
})
export class CodeComponent implements AfterViewInit, OnDestroy {
  private _displayIdMap = new Map<string, number[]>();

  name: string;
  renderMime: RenderMimeRegistry = new RenderMimeRegistry({
    initialFactories,
    sanitizer: {
      sanitize: (input: string) => input
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

  firstDisplay: PromiseDelegate<null>;

  code: string;
  @ViewChild('codecontainer') codecontainer: ElementRef;

  constructor(
    private myKernelSevice: KernelService,
    private _eRef: ElementRef
  ) { }

  updateOutputAreaModel() {
    this.outputAreaOptions = {
      model: this.model,
      rendermime: this.renderMime
    };
    this.outputAreaDispose();
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

    const element: HTMLElement = this._eRef.nativeElement;
    this.outputContainer = document.createElement('div');
    this.outputContainer.appendChild(this.outputArea.node);
    element.parentNode.parentNode.insertBefore(this.outputContainer, element.parentNode);

  }

  outputAreaDispose() {
    if (this.outputArea.future) {
      this.outputArea.future.done.then(() => {
        this.outputArea.dispose();
      });
    } else {
      this.outputArea.dispose();
    }
  }

  ngOnDestroy() {
    this.outputAreaDispose();
  }

  /**
   * Run the code within the code component. Update the output area with the results of the
   * code.
   */
  runCode(): Promise<null> {
    const codeCompleted = new PromiseDelegate<null>();
    this.promise = this.myKernelSevice.runCode(this.code, this.name);
    this.promise.then(future => {
      if (future) {
        this.firstDisplay = new PromiseDelegate();
        this.model = new OutputAreaModel();

        future.onIOPub = this._onIOPub;
        future.done.then(() => {
          codeCompleted.resolve(null);
        });

        this.firstDisplay.promise.then(() => {
          this.updateOutputAreaModel();

          this.outputContainer.replaceChild(this.outputArea.node, this.outputContainer.firstChild);
          const element: HTMLDivElement = this.outputContainer;
          element.style.minHeight = String(this.outputArea.node.clientHeight) + 'px';
        });
      } else {
        codeCompleted.resolve(null);
      }
    });
    return codeCompleted.promise;
  }

  // Extract from @jupyterlab/outputarea/src/widget.ts
  private _onIOPub = (msg: KernelMessage.IIOPubMessage) => {
    const model = this.model;
    const msgType = msg.header.msg_type;
    let output: nbformat.IOutput;
    const transient = (msg.content.transient || {}) as JSONObject;
    const displayId = transient['display_id'] as string;
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
      const wait = (msg as KernelMessage.IClearOutputMsg).content.wait;
      model.clear(wait);
      break;
    case 'update_display_data':
      output = msg.content as nbformat.IOutput;
      output.output_type = 'display_data';
      targets = this._displayIdMap.get(displayId);
      if (targets) {
        for (const index of targets) {
          model.set(index, output);
        }
      }
      break;
    default:
      break;
    }
    if (msgType === 'display_data' || msgType === 'stream' || msgType === 'update_display_data') {
      this.firstDisplay.resolve(null);
    }
    if (displayId && msgType === 'display_data') {
       targets = this._displayIdMap.get(displayId) || [];
       targets.push(model.length - 1);
       this._displayIdMap.set(displayId, targets);
    }
    // this.onIOPub.next(msg);
  }
}
