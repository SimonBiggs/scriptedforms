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
  
@Component({
  selector: 'toolbar',
  template: `<span #container></span><toolbar-button hidden></toolbar-button>`
})
export class ToolbarComponent implements AfterViewInit {
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  buttonFactory: ComponentFactory<ToolbarButtonComponent>

  constructor(
    private myComponentFactoryResolver: ComponentFactoryResolver,
    private myToolbarService: ToolbarService,
    private changeDetectorRef: ChangeDetectorRef
  ) {}

  ngAfterViewInit() {
    // this.addButton('save')
    this.addButton('print', () => {window.print()})
    // this.addButton('refresh')

    this.myToolbarService.addSpacer()
    
    this.changeDetectorRef.detectChanges()
  }

  addButton(icon: string, click: () => any) {
    this.buttonFactory = this.myComponentFactoryResolver.resolveComponentFactory(ToolbarButtonComponent)
    let button = this.container.createComponent(this.buttonFactory)
    button.instance.icon = icon
    button.instance.click = click
    let widget = new Widget({node: button.instance.myElementRef.nativeElement})

    this.myToolbarService.addItem(icon, widget)
  }
}
    