import { Component, OnInit, isDevMode } from '@angular/core';

import {
  Kernel, Session, ServerConnection
} from '@jupyterlab/services';

// The base url of the notebook server.



import { TitleService } from '../title.service'

@Component({
  selector: 'app-record',
  templateUrl: './record.component.html',
  styleUrls: ['./record.component.css']
})
export class RecordComponent implements OnInit {

  base_url: string
  settings: ServerConnection.ISettings



  options: Session.IOptions



  session: Session.ISession;

  code = [
    'import matplotlib.pyplot as plt',
    '%matplotlib inline',
    'plt.plot([0,1], [0,1])'
  ].join('\n')


  constructor(
    private myTitleService: TitleService,
  ) { 

  }

  ngOnInit() {
    this.myTitleService.set('Record Results');

    if(isDevMode()) {
      this.settings = ServerConnection.makeSettings({ 
        baseUrl: 'http://localhost:8888'
      })
    }
    else {
      this.settings = ServerConnection.makeSettings({})
    }

    this.options = {
      kernelName: 'python3',
      serverSettings: this.settings
    };

    Kernel.startNew(this.options).then(kernel => {

      let future = kernel.requestExecute({ code: this.code })

      future.onIOPub = (msg) => {
        console.log(msg.content)
      }
    })


  }

}