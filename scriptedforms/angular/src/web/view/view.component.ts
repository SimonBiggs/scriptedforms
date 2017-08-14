import { Component, OnInit } from '@angular/core';

// import { TitleService } from '../title.service'

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit{

  constructor(
    // private myTitleService: TitleService,
  ) { }

  ngOnInit() {
    // this.myTitleService.set('View Written Results');
  }


}
