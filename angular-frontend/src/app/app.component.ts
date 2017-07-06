import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { TitleService } from './title.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  pageTitle: string;

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
  }

  updatePageTitle() {
    this.pageTitle = this.myTitleService.get();
  }

}
