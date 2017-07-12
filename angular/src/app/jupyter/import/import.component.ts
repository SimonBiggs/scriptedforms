import { 
  Component, OnInit, ContentChildren, QueryList, AfterViewInit
} from '@angular/core';

import { CodeComponent } from '../code/code.component'

@Component({
  selector: 'import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.css']
})
export class ImportComponent implements OnInit, AfterViewInit {

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
