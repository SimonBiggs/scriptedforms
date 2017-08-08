import {
  Component, OnInit, ContentChildren, QueryList, AfterViewInit
} from '@angular/core';

import { CodeComponent } from '../code/code.component'
import { KernelService } from '../kernel.service'

@Component({
  selector: 'jupyter-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit, AfterViewInit {

  buttonId: number;
  afterViewInit = false;
  isFormReady = false;

  codeRunning = false;

  @ContentChildren(CodeComponent) codeComponents: QueryList<CodeComponent>

  constructor(
    private myKernelSevice: KernelService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.afterViewInit = true
  }

  runCode() {
    if (this.afterViewInit && this.isFormReady) {
      this.codeComponents.toArray().forEach((codeComponent, index) => {
        codeComponent.runCode(
          '"button"_' + String(this.buttonId) + '_' + String(index))
      })
      this.codeRunning = true
      this.myKernelSevice.queue.then(() => {
        this.codeRunning = false
      })
    }
  }

  formReady() {
    this.isFormReady = true
  }

  setId(id) {
    this.buttonId = id
  }

}
