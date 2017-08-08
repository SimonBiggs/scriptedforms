import {
  Component, OnInit, ContentChildren, QueryList, AfterViewInit
} from '@angular/core';

import { CodeComponent } from '../code/code.component'

@Component({
  selector: 'jupyter-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit, AfterViewInit {

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  runCode() {
    for (let codeComponent of this.codeComponents.toArray()) {
      codeComponent.runCode()
    }
  }
}
