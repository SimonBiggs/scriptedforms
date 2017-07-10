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

  queue: Promise<any> = Promise.resolve()

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

  addToQueue(fn: () => Promise<any>) {
    const prev = this.queue;
    return this.queue = (async () => {
      await prev;
      return await fn();
    })();
  }

  permissionCheck(): void {
    this.startKernel()
    this.runCode(this.testcode)
    this.shutdownKernel()
  }

  startKernel(inputkenel?: Kernel.IKernel): Promise<void> {
    return this.addToQueue(async () => {
      await Kernel.startNew(this.options).then(newKernel => {
        this.kernel = newKernel
      }).catch(err => {
        if (err.xhr.status == 403) {
          window.location.pathname = '/login'
        }
        console.error(err);
      })
    })
  }

  shutdownKernel(): Promise<void> {
    return this.addToQueue(async () => {
      await this.kernel.shutdown()
    })
  }

  runCode(code: string): Kernel.IFuture  {
    let future: Kernel.IFuture
    
    this.addToQueue(async () => {
      future = this.kernel.requestExecute({ code: code })
      future.onIOPub = (msg => {
        console.log(msg.content)
      })
      await future.done
    })
    
    return future
  }

}
