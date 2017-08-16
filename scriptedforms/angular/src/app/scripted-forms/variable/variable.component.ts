import {
  Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit,
  ChangeDetectorRef, EventEmitter, Output
} from '@angular/core';

import { Kernel } from '@jupyterlab/services';

import { KernelService } from '../kernel.service';

@Component({
  selector: 'jupyter-variable',
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.css']
})
export class VariableComponent implements OnInit, AfterViewInit {
  fetchCode: string
  setCode: string
  isFormReady = false;

  @Input('type') inputType: string
  @Output() variableChange = new EventEmitter<any>();

  @ViewChild('variablecontainer') variablecontainer: ElementRef

  variableName: string
  oldVariableValue: any = null
  variableValue: any

  constructor(
    private myChangeDetectorRef: ChangeDetectorRef,
    private myKernelSevice: KernelService
  ) { }

  ngOnInit() {
    if (!this.inputType.match('string') && !this.inputType.match('number')) {
      throw new RangeError(`When creating a variable must declare the type as either 'string' or 'number'
eg: &lt;variable type="string"&gt;name&lt;/variable&gt; or
    &lt;variable type="number"&gt;name&lt;/variable&gt;`)
    }
  }

  variableChanged(value) {
    // console.log('variable change')
    if (this.inputType.match('string')) {
      let escapedQuotes = this.variableValue.replace(/\"/g, '\\"')
      this.setCode = `${this.variableName} = "${escapedQuotes}"`
    }
    if (this.inputType.match('number')) {
      this.setCode = `${this.variableName} = ${this.variableValue}`
    }


    if (this.variableValue != this.oldVariableValue) {
      this.myKernelSevice.runCode(
        this.setCode, '"set"_"' + this.variableName + '"'
      ).then(future => {
        if (future) {
          return future.done
        }
        else {
          return Promise.resolve('ignore')
        }

      }).then((status) => {
        if (status != 'ignore') {
          this.variableChange.emit(this.variableName)
        }
      })
      this.oldVariableValue = this.variableValue
    }

  }

  ngAfterViewInit() {
    this.variableName = this.variablecontainer.nativeElement.innerHTML
    this.myChangeDetectorRef.detectChanges()

    this.fetchCode = `
try:
    print(${this.variableName})
except:
    print('')
`
  }

  fetchVariable() {
    this.myKernelSevice.runCode(this.fetchCode, '"fetch"_"' + this.variableName + '"').then(future => {
      future.onIOPub = (msg => {
        if (msg.content.name == "stdout") {
          if (this.inputType.match('string')) {
            this.variableValue = String(msg.content.text)
          }
          if (this.inputType.match('number')) {
            this.variableValue = Number(msg.content.text)
          }
        }
      })
    })
  }

  formReady() {
    this.isFormReady = true
  }
}
