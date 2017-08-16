import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material'

import { CodeComponent } from './code/code.component';

import { KernelService } from './kernel.service';
import { StartComponent } from './start/start.component';
import { LiveComponent } from './live/live.component';
import { ButtonComponent } from './button/button.component';
import { VariableComponent } from './variable/variable.component';
import { FormComponent } from './form/form.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ],
  declarations: [
    CodeComponent,
    StartComponent,
    LiveComponent,
    ButtonComponent,
    VariableComponent
  ],
  providers: [
    KernelService
  ],
  exports: [
    CodeComponent,
    StartComponent,
    LiveComponent,
    ButtonComponent,
    VariableComponent
  ]
})
export class FormWidgetsModule { }
