import { Component, OnInit, ChangeDetectorRef } from '@angular/core';

import { TitleService } from '../title.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    private myChangeDetectorRef: ChangeDetectorRef,
    private myTitleService: TitleService
  ) { }

  ngOnInit() {
    this.myTitleService.set('Home');
    this.myChangeDetectorRef.detectChanges()
  }

}
