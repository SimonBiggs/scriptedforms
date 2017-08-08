import {
  Component, OnInit, ContentChildren, QueryList, AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';

import { VariableComponent } from '../variable/variable.component'
import { CodeComponent } from '../code/code.component'

@Component({
  selector: 'jupyter-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.css']
})
export class LiveComponent implements OnInit, AfterViewInit {

  afterViewInit = false;
  isFormReady = false;

  @ContentChildren(VariableComponent) variableComponents: QueryList<VariableComponent>
  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>

  constructor(
      private myChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

  }

  ngAfterViewInit() {
    this.afterViewInit = true;
    for (let variableComponent of this.variableComponents.toArray()) {
      variableComponent.variableChange.asObservable().subscribe(
        value => this.variableChanged(value)
      )
    }
  }

  variableChanged(newVariable) {
    if (this.afterViewInit && this.isFormReady) {
      for (let codeComponent of this.codeComponents.toArray()) {
        codeComponent.runCode()
      }
    }
  }

  formReady() {
    this.isFormReady = true
    // for (let variableComponent of this.variableComponents.toArray()) {
    //   variableComponent.formReady()
    // }
  }
}
