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

  startId: number

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
  }

  runCode() {
    this.codeComponents.toArray().forEach((codeComponent, index) => {
      codeComponent.runCode(
        '"start"_' + String(this.startId) + '_' + String(index))
    })
  }

  setId(id) {
    this.startId = id
  }
}
