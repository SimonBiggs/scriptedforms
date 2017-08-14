import { Component, OnInit } from '@angular/core';

// import { TitleService } from '../title.service'

@Component({
  selector: 'app-share',
  templateUrl: './share.component.html',
  styleUrls: ['./share.component.css']
})
export class ShareComponent implements OnInit {

  constructor(
    // private myTitleService: TitleService
  ) { }

  ngOnInit() {
    // this.myTitleService.set('Share Forms');
  }

}
