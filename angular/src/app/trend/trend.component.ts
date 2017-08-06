import { Component, OnInit } from '@angular/core';

// import { TitleService } from '../title.service'

@Component({
  selector: 'app-trend',
  templateUrl: './trend.component.html',
  styleUrls: ['./trend.component.css']
})
export class TrendComponent implements OnInit {

  constructor(
    // private myTitleService: TitleService
  ) { }

  ngOnInit() {
    // this.myTitleService.set('Show Trends');
  }

}
