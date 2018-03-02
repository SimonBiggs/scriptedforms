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
} from "@phosphor/widgets";

import {
  ToolbarButtonComponent
} from './toolbar-button.component';

import {
  ToolbarService
} from '../services/toolbar.service';

import { FormService } from "../services/form.service";
  
interface IOptions {
  click: () => void;
  icon?: string;
  disable?: BehaviorSubject<boolean>;
  iconClass?: string;
  tooltip?: string;
}

@Component({
  selector: 'toolbar',
  template: `<span #container></span><toolbar-button hidden></toolbar-button>`
})
export class ToolbarComponent implements AfterViewInit {
  restartingKernel: BehaviorSubject<boolean> = new BehaviorSubject(false)

  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  buttonFactory: ComponentFactory<ToolbarButtonComponent>

  constructor(
    private myComponentFactoryResolver: ComponentFactoryResolver,
    private myToolbarService: ToolbarService,
    private myFormService: FormService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    this.addButton({
      icon: 'chrome_reader_mode',
      click: () => { window.open("http://scriptedforms.com.au", '_blank')},
      tooltip: 'ScriptedForms documentation, installation instructions, and source code.'
    })
    this.addButton({
      click: () => {window.print()}, 
      icon: 'print',
      tooltip: 'Print your ScriptedForm'
    })
    this.addButton({
      click: () => {this.restartKernel()},
      icon: 'refresh',
      disable: this.restartingKernel,
      tooltip: 'Restart the Jupyter Python Kernel. This will reset your inputs.'
    })

    this.myToolbarService.addSpacer()
    
    this.changeDetectorRef.detectChanges()
  }

  addButton(options: IOptions) {
    let name: string
    this.buttonFactory = this.myComponentFactoryResolver.resolveComponentFactory(ToolbarButtonComponent)
    let button = this.container.createComponent(this.buttonFactory)
    button.instance.click = options.click
    
    if (options.icon) {
      button.instance.icon = options.icon
      name = options.icon
    }
    if (options.disable) {
      button.instance.disable = options.disable
    }
    if (options.tooltip) {
      button.instance.tooltip = options.tooltip
    }
    if (options.iconClass) {
      button.instance.iconClass = options.iconClass
      name = options.iconClass
    }

    let widget = new Widget({node: button.instance.myElementRef.nativeElement})
    this.myToolbarService.addItem(name, widget)
  }

  restartKernel() {
    this.restartingKernel.next(true)
    this.myFormService.restartFormKernel().then(() => {
      this.restartingKernel.next(false)
    })
  }
}
    