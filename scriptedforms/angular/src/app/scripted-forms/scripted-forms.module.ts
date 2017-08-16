import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MaterialModule } from '@angular/material'

import { FormWidgetsModule } from './form-widgets.module';

import { CodeComponent } from './code/code.component';

import { KernelService } from './kernel.service';
import { FormComponent } from './form/form.component';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    FormWidgetsModule
  ],
  declarations: [
    FormComponent
  ],
  providers: [
    KernelService
  ],
  exports: [
    FormComponent
  ]
})
export class ScriptedFormsModule { }
