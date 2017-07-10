import { Component, OnInit, isDevMode } from '@angular/core';

import { Router } from '@angular/router';

import {
  Kernel, Session, ServerConnection, ContentsManager
} from '@jupyterlab/services';

import { TitleService } from './title.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pageTitle: string;

  settings: ServerConnection.ISettings
  options: Session.IOptions

  sourceUrl: string
  
  contents: ContentsManager

  constructor (
    private myTitleService: TitleService,
    private myRouter: Router,
  ) {
    myRouter.events.subscribe(() => {
      this.updatePageTitle()
    })
  }

  ngOnInit() {
    this.updatePageTitle()

    if(isDevMode()) {
      this.sourceUrl = 'http://localhost:8888/forms/downloadsource'
      this.settings = ServerConnection.makeSettings({ 
        baseUrl: 'http://localhost:8888'
      })
    }
    else {
      this.sourceUrl = '/forms/downloadsource'
      this.settings = ServerConnection.makeSettings({})
    }

    this.options = {
      serverSettings: this.settings
    };

    Kernel.startNew(this.options).then(kernel => {
      // this.sleep(2000)
      kernel.shutdown()
    }).catch(err => {
      if (err.xhr.status == 403) {
        window.location.pathname = '/login'
      }
      console.error(err);
    });
  }

  // async sleep(ms) {
  //   await new Promise(resolve => setTimeout(resolve, ms));
  // }

  updatePageTitle() {
    this.pageTitle = this.myTitleService.get();
  }
}
