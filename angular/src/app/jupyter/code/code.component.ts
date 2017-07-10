import { 
  Component, OnInit, AfterViewInit, ViewChild, ElementRef
} from '@angular/core';

import { Kernel } from '@jupyterlab/services';

import { KernelService } from '../kernel.service';

@Component({
  selector: 'code',
  templateUrl: './code.component.html',
  styleUrls: ['./code.component.css']
})
export class CodeComponent implements OnInit, AfterViewInit {

  queue: Promise<Object[]>

  code: string
  @ViewChild('codecontainer') codecontainer: ElementRef

  constructor(
    private myKernelSevice: KernelService
  ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.code = this.codecontainer.nativeElement.innerHTML
    // console.log(this.code)

    this.queue = this.myKernelSevice.runCode(this.code)

    this.queue.then(data => {
      console.log(data)
    })
  }

}
