import { Injectable, isDevMode } from '@angular/core';

import {
  Kernel, KernelMessage, Session, ServerConnection
} from '@jupyterlab/services';

@Injectable()
export class KernelService {
  settings: ServerConnection.ISettings
  options: Session.IOptions
  session: Session.ISession;
  kernel: Kernel.IKernel

  queue: Promise<any>

  testcode = [
    'import numpy as np',
    'import matplotlib.pyplot as plt',
    '%matplotlib inline',
    'x = np.linspace(-10,10)',
    'y = x**2',
    'plt.plot(x, y)'
  ].join('\n')

  constructor() {
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
   }

  // permissionCheck(): Promise<void> {
  //   let promise = this.startKernel().then(() => {
  //     return this.runCode(this.testcode)
  //   }).then((message) => {
  //     // console.log(message)
  //     return this.shutdownKernel()
  //   })

  //   return promise
  // }

  permissionCheck(): Promise<void> {
    let dummykernel: Kernel.IKernel

    let promise = Kernel.startNew(this.options).then(newkernel => {
      dummykernel = newkernel
      return Promise.resolve();
    }).catch(err => {
      if (err.xhr.status == 403) {
        window.location.pathname = '/login'
      }
      console.error(err);
    });

    return promise.then(() => {
      let future = dummykernel.requestExecute({ code: this.testcode })
      return future.done
    }).then(() => {
      return dummykernel.shutdown()
    })
  }

  startKernel(inputkenel?: Kernel.IKernel): Promise<void> {
    this.queue = Kernel.startNew(this.options)

    this.queue = this.queue.then(newkernel => {
      this.kernel = newkernel
      return Promise.resolve();
    }).catch(err => {
      if (err.xhr.status == 403) {
        window.location.pathname = '/login'
      }
      console.error(err);
    });

    return this.queue
  }

  shutdownKernel(): Promise<void> {
    return this.queue.then(() => {
      return this.kernel.shutdown()
    })
  }

  runCode(code: string): Kernel.IFuture {
    let future = this.kernel.requestExecute({ code: code })

    future.onIOPub = (msg) => {
      console.log(msg.content)
    }

    // future.onReply = (msg) => {
    //   console.log(msg.content)
    // }

    // console.log(future)
    return future
  }

  addToCodeQueue(code: string): Promise<Kernel.IFuture> {
    let future: Kernel.IFuture
    
    return this.queue.then(() => {
      future = this.runCode(code)
      this.queue = future.done
      // console.log(future)
      return future
    })
  }
}
