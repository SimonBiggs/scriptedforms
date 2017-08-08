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
    'print(x)',
    'print(y)',
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

  addToQueue(asyncFunction:() => Promise<any>): Promise<any>{
    const previous = this.queue;
    return this.queue = (async () => {
      await previous;
      return asyncFunction();
    })();
  }

  permissionCheck(): Promise<any> {
    this.startKernel()
    this.runCode(this.testcode)
    this.shutdownKernel()

    return this.queue
  }

  startKernel(): Promise<void> {
    return this.addToQueue(async (): Promise<void> => {
      console.log('Start Kernel Queue Item')
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
    return this.addToQueue(async (): Promise<void> => {
      console.log('Shutdown Kernel Queue Item')
      await this.kernel.shutdown()
    })
  }

  forceShutdownKernel(): Promise<void> {
    this.queue = Promise.resolve()
    return this.shutdownKernel()
  }

  resetKernel(): Promise<void> {
    this.forceShutdownKernel()
    return this.startKernel()
  }

  runCode(code: string): Promise<Kernel.IFuture> {
    let future: Kernel.IFuture

    const currentQueue = this.addToQueue(async (): Promise<Kernel.IFuture> => {
      console.log('Run Code Queue Item')

      future = this.kernel.requestExecute({ code: code })
      return future
    })
    this.addToQueue(async (): Promise<any> => {
      return await future.done
    })

    return currentQueue
  }
}
