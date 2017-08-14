import { Component, OnInit } from '@angular/core';

// import { TitleService } from '../title.service'

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(
    // private myTitleService: TitleService
  ) { }

  ngOnInit() {
    // this.myTitleService.set('Page not Found');
  }
}
