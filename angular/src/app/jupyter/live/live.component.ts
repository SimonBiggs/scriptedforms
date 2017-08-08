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

  liveId: number
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

  variableChanged(variableName) {
    if (this.afterViewInit && this.isFormReady) {
      this.codeComponents.toArray().forEach((codeComponent, index) => {
        codeComponent.runCode(
          '"live"_' + String(this.liveId) + '_' + String(index))
      })
    }
  }

  formReady() {
    this.isFormReady = true
  }

  setId(id) {
    this.liveId = id
  }
}
