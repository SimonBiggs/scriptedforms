import { Component, OnInit, isDevMode } from '@angular/core';

// import { TitleService } from '../title.service'

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {

  constructor(
    // private myTitleService: TitleService,
  ) { }

  ngOnInit() {
    // this.myTitleService.set('Record Results');
  }
}
