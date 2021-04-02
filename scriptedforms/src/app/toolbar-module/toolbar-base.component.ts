// Scripted Forms -- Making GUIs easy for everyone on your team.
// Copyright (C) 2017 Simon Biggs

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/*
Creates the [button] section.

A section that runs all code within it whenever the user presses the provided
button.

By calling the function `runCode` on this component all code components within
this section will be iteratively run. The button is set to call the runCode
function on click.
*/

import { BehaviorSubject } from 'rxjs';

import {
  ComponentFactoryResolver, AfterViewInit, ComponentFactory, ViewChild,
  ViewContainerRef, ChangeDetectorRef
} from '@angular/core';

import {
  Component,
  //  Input
} from '@angular/core';

import {
  // BoxLayout,
  Widget
} from '@phosphor/widgets';

import {
  ToolbarButtonComponent, IOptions
} from './toolbar-button.component';

import {
  ToolbarService
} from '../services/toolbar.service';

import { FormService } from '../services/form.service';

@Component({
  selector: 'toolbar-base',
  template: `<span #container></span><toolbar-button hidden></toolbar-button>`
})
export class ToolbarBaseComponent implements AfterViewInit {
  restartingKernel: BehaviorSubject<boolean> = new BehaviorSubject(false);

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  buttonFactory: ComponentFactory<ToolbarButtonComponent>;

  constructor(
    private myComponentFactoryResolver: ComponentFactoryResolver,
    private myToolbarService: ToolbarService,
    private myFormService: FormService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    this.addButton({
      icon: 'chrome_reader_mode',
      // href: '../docs',  // Only change this link once the docs are ready
      href: 'https://scriptedforms.com.au',
      tooltip: 'ScriptedForms documentation, installation instructions, and source code.'
    });
    this.addButton({
      click: () => { window.print(); },
      icon: 'print',
      tooltip: 'Print your ScriptedForm'
    });
    this.addButton({
      click: () => { this.restartKernel(); },
      icon: 'refresh',
      disable: this.restartingKernel,
      tooltip: 'Restart the Jupyter Python Kernel. This will reset your inputs.'
    });

    this.myToolbarService.addSpacer();

    this.changeDetectorRef.detectChanges();
  }

  addButton(options: IOptions) {
    this.buttonFactory = this.myComponentFactoryResolver.resolveComponentFactory(ToolbarButtonComponent);
    const button = this.container.createComponent(this.buttonFactory);

    button.instance.options = options;

    const widget = new Widget({ node: button.instance.myElementRef.nativeElement });
    this.myToolbarService.addItem(options.icon, widget);
  }

  restartKernel() {
    this.restartingKernel.next(true);
    this.myFormService.restartFormKernel().then(() => {
      this.restartingKernel.next(false);
    });
  }
}
