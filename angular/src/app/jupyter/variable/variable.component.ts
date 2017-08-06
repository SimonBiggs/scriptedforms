import {
  Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit,
  ChangeDetectorRef, EventEmitter, Output, OnChanges
} from '@angular/core';

import { Kernel } from '@jupyterlab/services';

import { KernelService } from '../kernel.service';

@Component({
  selector: 'variable',
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
    // this.myChangeDetectorRef.detectChanges()
    console.log('variable change')
    this.setCode = `${this.variableName} = ${this.variableValue}`

    this.myKernelSevice.runCode(this.setCode).then(future => {
      return future.done
    }).then(() => {
      this.variableChange.emit(this.variableValue)
    })
  }

  ngAfterViewInit() {
    this.variableName = this.variablecontainer.nativeElement.innerHTML
    this.myChangeDetectorRef.detectChanges()

    this.fetchCode = `
if '${this.variableName}' in locals():
    print(${this.variableName})
else:
    print('')
`
  }

  fetchVariable() {
    this.myKernelSevice.runCode(this.fetchCode).then(future => {
      future.onIOPub = (msg => {
        if (msg.content.name == "stdout") {
          if (this.inputType.match('string')) {
            this.variableValue = String(msg.content.text)
          }
          if (this.inputType.match('number')) {
            this.variableValue = Number(msg.content.text)
          }
          // this.myChangeDetectorRef.detectChanges()
        }
      })
    })
  }

  formReady() {
    this.isFormReady = true
    // this.myChangeDetectorRef.detectChanges()
  }
}
