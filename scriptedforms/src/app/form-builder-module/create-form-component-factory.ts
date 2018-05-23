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
  Component, ViewChildren, QueryList, Compiler, ComponentFactory, NgModule,
  ModuleWithComponentFactories, ChangeDetectorRef, AfterViewInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { PromiseDelegate } from '@phosphor/coreutils';
import { Kernel } from '@jupyterlab/services';

import { MaterialModule } from '../../vendors/material.module';

import { sessionStartCode } from './session-start-code';

import { KernelService } from '../services/kernel.service';
import { VariableService } from '../services/variable.service';

import { SectionsModule } from '../sections-module/sections.module';
import { StartComponent } from '../sections-module/start.component';
import { LiveComponent } from '../sections-module/live.component';
import { ButtonComponent } from '../sections-module/button.component';
import { OutputComponent } from '../sections-module/output.component';
import { SectionFileChangeComponent } from '../sections-module/section-file-change.component';

import { VariablesModule } from '../variables-module/variables.module';
import { ToggleComponent } from '../variables-module/toggle.component';
import { TickComponent } from '../variables-module/tick.component';

import { NumberComponent } from '../variables-module/number.component';
import { SliderComponent } from '../variables-module/slider.component';
import { VariableTableComponent } from '../variables-module/variable-table.component';

import { StringComponent } from '../variables-module/string.component';
import { DropdownComponent } from '../variables-module/dropdown.component';

import { VariableFileComponent } from '../variables-module/variable-file.component';

import { CodeModule } from '../code-module/code.module';
import { CodeComponent } from '../code-module/code.component';

import { VariableComponent } from '../types/variable-component';
import { SectionComponent } from '../types/section-component';

export
interface IFormComponent {
  formViewInitialised: PromiseDelegate<void>;
  formReady: PromiseDelegate<void>;
  restartFormKernel(): Promise<void>;
}


/**
 * Create a form component factory given an Angular template in the form of metadata.
 *
 * @param compiler the Angular compiler
 * @param metadata the template containing metadata
 *
 * @returns a factory which creates form components
 */
export
function createFormComponentFactory(
  compiler: Compiler, metadata: Component): ComponentFactory<IFormComponent> {
  /**
   * The form component that is built each time the template changes
   */
  @Component(metadata)
  class FormComponent implements IFormComponent, AfterViewInit {
    formViewInitialised = new PromiseDelegate<void>();
    formReady = new PromiseDelegate<void>();

    variableComponents: VariableComponent[] = [];
    sectionComponents: SectionComponent[] = [];

    // Sections
    @ViewChildren(StartComponent) startComponents: QueryList<StartComponent>;
    @ViewChildren(LiveComponent) liveComponents: QueryList<LiveComponent>;
    @ViewChildren(ButtonComponent) buttonComponents: QueryList<ButtonComponent>;
    @ViewChildren(OutputComponent) outputComponents: QueryList<OutputComponent>;
    @ViewChildren(SectionFileChangeComponent) sectionFileChangeComponents: QueryList<SectionFileChangeComponent>;

    // Variables
    @ViewChildren(ToggleComponent) toggleComponents: QueryList<ToggleComponent>;
    @ViewChildren(TickComponent) tickComponents: QueryList<TickComponent>;

    @ViewChildren(NumberComponent) numberComponents: QueryList<NumberComponent>;
    @ViewChildren(SliderComponent) sliderComponents: QueryList<SliderComponent>;
    @ViewChildren(VariableTableComponent) variableTableComponents: QueryList<VariableTableComponent>;

    @ViewChildren(StringComponent) stringComponents: QueryList<StringComponent>;
    @ViewChildren(DropdownComponent) dropdownComponents: QueryList<DropdownComponent>;

    @ViewChildren(VariableFileComponent) variableFileComponents: QueryList<VariableFileComponent>;

    // Code
    @ViewChildren(CodeComponent) codeComponents: QueryList<CodeComponent>;

    constructor(
      private myKernelService: KernelService,
      private myVariableService: VariableService,
      private myChangeDetectorRef: ChangeDetectorRef
    ) { }

    ngAfterViewInit() {
      this.formViewInitialised.resolve(null);

      this.variableComponents = this.variableComponents.concat(this.toggleComponents.toArray());
      this.variableComponents = this.variableComponents.concat(this.tickComponents.toArray());

      this.buttonComponents.toArray().forEach(buttonComponent => {
        if (buttonComponent.conditional) {
          this.variableComponents = this.variableComponents.concat([buttonComponent.conditionalComponent]);
        }
      });

      this.variableComponents = this.variableComponents.concat(this.numberComponents.toArray());
      this.variableComponents = this.variableComponents.concat(this.sliderComponents.toArray());
      this.variableComponents = this.variableComponents.concat(this.variableTableComponents.toArray());

      this.variableTableComponents.toArray().forEach(variableTableComponent => {
        if (variableTableComponent.inputTypes) {
          this.variableComponents = this.variableComponents.concat([variableTableComponent.variableInputTypes]);
        }
        if (variableTableComponent.dropdownItems) {
          this.variableComponents = this.variableComponents.concat([variableTableComponent.variableDropdownItems]);
        }
      });

      this.variableComponents = this.variableComponents.concat(this.stringComponents.toArray());
      this.variableComponents = this.variableComponents.concat(this.dropdownComponents.toArray());

      this.dropdownComponents.toArray().forEach(dropdownComponent => {
        if (dropdownComponent.items) {
          this.variableComponents = this.variableComponents.concat([dropdownComponent.variableParameterComponent]);
        }
      });

      this.variableComponents = this.variableComponents.concat(this.variableFileComponents.toArray());

      this.sectionComponents = this.sectionComponents.concat(this.startComponents.toArray());
      this.sectionComponents = this.sectionComponents.concat(this.liveComponents.toArray());
      this.sectionComponents = this.sectionComponents.concat(this.buttonComponents.toArray());
      this.sectionComponents = this.sectionComponents.concat(this.outputComponents.toArray());
      this.sectionComponents = this.sectionComponents.concat(this.sectionFileChangeComponents.toArray());

      this.sectionFileChangeComponents.toArray().forEach(sectionFileChangeComponent => {
        this.variableComponents = this.variableComponents.concat([sectionFileChangeComponent.variableParameterComponent]);
      });

      this.sectionComponents.forEach((sectionComponent, index) => {
        sectionComponent.setId(index);
      });
      this.variableComponents.forEach((variableComponent, index) => {
        variableComponent.setId(index);
      });
      this.myChangeDetectorRef.detectChanges();

      this.initialiseForm();
    }

    /**
     * Initialise the form. Code ordering during initialisation is defined here.
     */
    private initialiseForm() {
      this.myVariableService.resetVariableService();
      this.myKernelService.queueReset();

      const sessionStartCodeComplete = new PromiseDelegate<boolean>();
      this.myKernelService.runCode(sessionStartCode, '"session_start_code"')
      .then((future: Kernel.IFuture) => {
        if (future) {
          let textContent = '';
          future.onIOPub = (msg => {
            if (msg.content.text) {
              textContent = textContent.concat(String(msg.content.text));
            }
          });
          future.done.then(() => sessionStartCodeComplete.resolve(JSON.parse(textContent)));
        }
      });
      sessionStartCodeComplete.promise.then(isNewSession => {
        if (isNewSession) {
          console.log('Restoring old session');
        } else {
          console.log('Starting a new session');
        }

        this.variableComponents.forEach((variableComponent, index) => {
          variableComponent.initialise();
        });

        this.myVariableService.startListeningForChanges();

        this.myVariableService.allVariablesInitilised().then(() => {
          const initialPromise = Promise.resolve(null);
          const startPromiseList: Promise<null>[] = [initialPromise];
          this.startComponents.toArray().forEach((startComponent, index) => {
            // console.log(startComponent);
            if (isNewSession) {
              startPromiseList.push(
                startPromiseList[startPromiseList.length - 1].then(() => startComponent.runCode())
              );
            } else if (startComponent.always === '') {
              startPromiseList.push(
                startPromiseList[startPromiseList.length - 1].then(() => startComponent.runCode())
              );
            }
          });
          return Promise.all(startPromiseList);
        }).then(() => {
          const initialPromise = Promise.resolve(null);
          const sectionPromiseList: Promise<null>[] = [initialPromise];
          this.sectionComponents.forEach(sectionComponent => {
            if (sectionComponent.onLoad === '') {
              sectionPromiseList.push(
                sectionPromiseList[sectionPromiseList.length - 1].then(() => sectionComponent.runCode())
              );
            }
          });
          // Wait until the code queue is complete before declaring form ready to
          // the various components.
          return Promise.all(sectionPromiseList);
        })
        .then(() => {
          this.liveComponents.toArray().forEach(liveComponent => liveComponent.subscribe());
          this.outputComponents.toArray().forEach(outputComponent => outputComponent.subscribeToVariableChanges());
          this.sectionComponents.forEach(sectionComponent => sectionComponent.formReady(true));
          this.variableComponents.forEach(variableComponent => variableComponent.formReady(true));
          this.formReady.resolve(null);
        });
      });
    }

    public restartFormKernel() {
      this.formReady = new PromiseDelegate<void>();
      this.variableComponents.forEach(variableComponent => {
        variableComponent.variableValue = null;
        variableComponent.formReady(false);
      });
      this.sectionComponents.forEach(sectionComponent => {
        sectionComponent.kernelReset();
        sectionComponent.formReady(false);
      });
      this.myKernelService.restartKernel().then(() => {
        this.initialiseForm();
      });

      return this.formReady.promise;
    }
  }

  // The Angular module for the form component
  @NgModule(
    {
      imports: [
        CommonModule,
        FormsModule,
        MaterialModule,
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
