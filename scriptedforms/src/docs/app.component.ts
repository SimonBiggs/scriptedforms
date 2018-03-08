import { Component, ViewChild, ElementRef } from '@angular/core';

import { ServiceManager, ContentsManager } from '@jupyterlab/services';
import { Toolbar } from '@jupyterlab/apputils';

import { IScriptedForms, InitialisationService } from '../app/services/initialisation.service'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  @ViewChild('content') content: ElementRef;

  constructor(
    private myInitialisationService: InitialisationService,
  ) {}

  ngAfterViewInit() {
    let content = <HTMLDivElement>this.content.nativeElement

    let options: IScriptedForms.IOptions = {
      serviceManager: new ServiceManager(),
      contentsManager: new ContentsManager(),
      node: content,
      toolbar: new Toolbar()
    }

    this.initiliseScriptedForms(options)
  }

  initiliseScriptedForms(options: IScriptedForms.IOptions) {
    this.myInitialisationService.initiliseScriptedForms(options)
  }
}
