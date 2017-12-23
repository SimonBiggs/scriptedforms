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



/**
 * Since the template for the form changes within the user interface
 * the form component needs to be re-compiled each time the template changes.
 * 
 * This file exports a the `createFormComponentFactory` function which
 * creates a new form component factory based on the provided template.
 * 
 * Within that function is the `FormComponent`. This component takes in the
 * provided template and then initialises the form.
 * 
 * Form initialisation logic and ordering is all defined within the `initialiseForm`
 * function within the `FormComponent`.
 */


import {
  Component, ViewChildren, QueryList,
  Compiler, ComponentFactory, NgModule,
  ModuleWithComponentFactories
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { KernelService } from '../services/kernel.service';
import { VariableService } from '../services/variable.service';

import { SectionsModule } from '../sections-module/sections.module';
import { StartComponent } from '../sections-module/start.component';
import { LiveComponent } from '../sections-module/live.component';
import { ButtonComponent } from '../sections-module/button.component';

import { VariablesModule } from '../variables-module/variables.module';
import { ToggleComponent } from '../variables-module/toggle.component';
import { TickComponent } from '../variables-module/tick.component';
import { NumberComponent } from '../variables-module/number.component';
import { SliderComponent } from '../variables-module/slider.component';
import { TableComponent } from '../variables-module/table.component';
import { StringComponent } from '../variables-module/string.component';

import { CodeModule } from '../code-module/code.module';
import { CodeComponent } from '../code-module/code.component';

import { VariableComponent } from '../types/variable-component';


/**
 * Create a form component factory given an Angular template in the form of metadata.
 * 
 * @param compiler the Angular compiler
 * @param metadata the template containing metadata
 * 
 * @returns a factory which creates form components
 */
export
function createFormComponentFactory(compiler: Compiler, metadata: Component): ComponentFactory<any> {

  /**
   * The form component that is built each time the template changes
   */
  @Component(metadata)
  class FormComponent {   
    variableComponents: VariableComponent[] = []

    // Sections
    @ViewChildren(StartComponent) startComponents: QueryList<StartComponent>;
    @ViewChildren(LiveComponent) liveComponents: QueryList<LiveComponent>;
    @ViewChildren(ButtonComponent) buttonComponents: QueryList<ButtonComponent>;

    // Variables
    @ViewChildren(ToggleComponent) toggleComponents: QueryList<ToggleComponent>;
    @ViewChildren(TickComponent) tickComponents: QueryList<TickComponent>;

    @ViewChildren(NumberComponent) numberComponents: QueryList<NumberComponent>;
    @ViewChildren(SliderComponent) sliderComponents: QueryList<SliderComponent>;
    @ViewChildren(TableComponent) tableComponents: QueryList<TableComponent>;

    @ViewChildren(StringComponent) stringComponents: QueryList<StringComponent>;

    // Code
    @ViewChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;
  
    constructor(
      private myKernelSevice: KernelService,
      private myVariableService: VariableService
    ) { }
  
    ngAfterViewInit() {
      this.variableComponents = this.variableComponents.concat(this.toggleComponents.toArray())
      this.variableComponents = this.variableComponents.concat(this.tickComponents.toArray())

      this.variableComponents = this.variableComponents.concat(this.numberComponents.toArray())
      this.variableComponents = this.variableComponents.concat(this.sliderComponents.toArray())
      this.variableComponents = this.variableComponents.concat(this.tableComponents.toArray())

      this.variableComponents = this.variableComponents.concat(this.stringComponents.toArray())

      this.initialiseForm();
    }

  
    /**
     * Initialise the form. Code ordering during initialisation is defined here.
     */
    private initialiseForm() {
      // Only begin initialisation once the kernel is connected
      this.myKernelSevice.sessionConnected.promise.then(() => {

        // console.log('session connected');
        // console.log(this.startComponents);

        // The start component section is run first
        

        this.startComponents.toArray().forEach((startComponent, index) => {
          startComponent.setId(index);
          startComponent.provideSections(
            this.liveComponents, this.buttonComponents);

          // Only run the code of a start component if it is a new session.
          // Once the data model for the form results has been built it can
          // be used to facilitate determining whether or not the code within
          // start component(s) have changed. If it has changed the code should
          // be re-run even if it isn't a new session.
          if (this.myKernelSevice.isNewSession) {
            startComponent.runCode();
          }
        });
        this.myKernelSevice.isNewSession = false;

        // Variable components are initialised second
        this.myVariableService.resetVariableService();
        
        this.variableComponents.forEach((variableComponent, index) => {
          variableComponent.initialise(index);
        })
        this.myVariableService.fetchAll()

        // Wait until the code queue is complete before declaring form ready to
        // the various components.
        this.myKernelSevice.queue.then(() => {
          
          // Make all variables update whenever a code component finishes
          // running.
          for (const codeComponent of this.codeComponents.toArray()) {
            codeComponent.aCodeRunCompleted.subscribe(() => {
              // this.pullAllVariables()
              this.myVariableService.fetchAll()
            });
          }

          // Tell the live components that the form is ready
          this.liveComponents.toArray().forEach((liveComponent, index) => {
            liveComponent.setId(index);
            liveComponent.formReady();
          });

          // Tell the variable components that the form is ready
          this.variableComponents.forEach(variableComponent => {
            variableComponent.formReady();
          })

          // Tell the button components that the form is ready
          this.buttonComponents.toArray().forEach((buttonComponent, index) => {
            buttonComponent.setId(index);
            buttonComponent.formReady();
          });
        });
      });
    }
  }

  // The Angular module for the form component
  @NgModule(
    {
      imports: [
        CommonModule,
        SectionsModule,
        VariablesModule,
        CodeModule
      ],  
      declarations: [
        FormComponent
      ]
    }
  )
  class FormComponentModule { }

  // Compile the template
  const module: ModuleWithComponentFactories<FormComponentModule> = (
    compiler.compileModuleAndAllComponentsSync(FormComponentModule));

  // Return the factory
  return module.componentFactories.find(
    f => f.componentType === FormComponent);
}