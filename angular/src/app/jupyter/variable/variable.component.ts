import { 
  Component, OnInit, Input, ViewChild, ElementRef, AfterViewInit, 
  ChangeDetectorRef
} from '@angular/core';

import { Kernel } from '@jupyterlab/services';

import { KernelService } from '../kernel.service';

@Component({
  selector: 'variable',
  templateUrl: './variable.component.html',
  styleUrls: ['./variable.component.css']
})
export class VariableComponent implements OnInit, AfterViewInit {
  code: string
  
  promise: Promise<Kernel.IFuture>
  future: Kernel.IFuture

  @Input('type') inputType: string
  @ViewChild('variablecontainer') variablecontainer: ElementRef

  variableName: string
  variableString: string
  variableNumber: number

  constructor(
    private myChangeDetectorRef: ChangeDetectorRef,
    private myKernelSevice: KernelService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.variableName = this.variablecontainer.nativeElement.innerHTML
    this.myChangeDetectorRef.detectChanges()

    this.code = `
if '${this.variableName}' in locals():
    print(${this.variableName})
else:
    print('')
`
  }

  fetchVariable() {
    this.promise = this.myKernelSevice.runCode(this.code)
    this.promise.then(future => {
      this.future = future
      this.future.onIOPub = (msg => {
        if (msg.content.name == "stdout") {
          // console.log(Number(msg.content.text))
          this.variableNumber = Number(msg.content.text)
          this.variableString = String(msg.content.text)
        }
        // console.log(msg.content)
      })
    })
  }
}
