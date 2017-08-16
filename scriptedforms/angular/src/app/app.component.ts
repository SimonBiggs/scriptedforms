import { Component, OnInit, isDevMode } from '@angular/core';

// import { Router } from '@angular/router';

// import { TitleService } from './title.service'
import { KernelService } from './scripted-forms/kernel.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pageTitle: string;

  sourceUrl: string

  constructor (
    // private myTitleService: TitleService,
    // private myRouter: Router,
    private myKernelSevice: KernelService
  ) {
    // myRouter.events.subscribe(() => {
    //   this.updatePageTitle()
    // })

    myKernelSevice.permissionCheck()
  }

  ngOnInit() {
    // this.updatePageTitle()

    if(isDevMode()) {
      this.sourceUrl = 'http://localhost:8888/forms/downloadsource'
    }
    else {
      this.sourceUrl = '/forms/downloadsource'
    }
  }

  // updatePageTitle() {
  //   this.pageTitle = this.myTitleService.get();
  // }
}
