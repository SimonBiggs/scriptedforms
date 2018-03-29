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
Creates the [button] section.

A section that runs all code within it whenever the user presses the provided
button.

By calling the function `runCode` on this component all code components within
this section will be iteratively run. The button is set to call the runCode
function on click.
*/

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

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
  ) {}

  ngAfterViewInit() {
    this.addButton({
      icon: 'chrome_reader_mode',
      // href: '../docs',  // Only change this link once the docs are ready
      href: 'http://scriptedforms.com.au',
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

    const widget = new Widget({node: button.instance.myElementRef.nativeElement});
    this.myToolbarService.addItem(options.icon, widget);
  }

  restartKernel() {
    this.restartingKernel.next(true);
    this.myFormService.restartFormKernel().then(() => {
      this.restartingKernel.next(false);
    });
  }
}
