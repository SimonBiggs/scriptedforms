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

  queueId = 0
  queueLog = {}

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
      // this.settings = ServerConnection.makeSettings({})
      // Use local server
      this.settings = ServerConnection.makeSettings({
        baseUrl: 'https://localhost:8888'
      })
    }

    this.options = {
      kernelName: 'python3',
      serverSettings: this.settings
    };
   }

  addToQueue(name: string, asyncFunction:(id: number) => Promise<any>): Promise<any>{
    const currentQueueId = this.queueId

    this.queueLog[currentQueueId] = name
    this.queueId += 1
    const previous = this.queue;
    return this.queue = (async () => {
      await previous;
      delete this.queueLog[currentQueueId]
      return asyncFunction(currentQueueId);
    })();
  }

  permissionCheck(): Promise<any> {
    this.startKernel()
    this.runCode(this.testcode, '"permissionCheck"_0')
    this.shutdownKernel()

    return this.queue
  }

  startKernel(): Promise<void> {
    return this.addToQueue(null, async (id:number): Promise<void> => {
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
    return this.addToQueue(null, async (id:number): Promise<void> => {
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

  runCode(code: string, name: string): Promise<any> {
    // console.log(this.queueLog)
    let future: Kernel.IFuture
    let runCode: boolean

    const currentQueue = this.addToQueue(
      name, async (id:number): Promise<any> => {
        runCode = true
        for (let key in this.queueLog ) {
          if (Number(key) > id && this.queueLog[key] == name) {
            runCode = false
            break
          }
        }
        if (runCode) {
          console.log('Run Code Queue Item')
          future = this.kernel.requestExecute({ code: code })
          return future
        }
        else {
          return Promise.resolve()
        }
      }
    )
    this.addToQueue(null, async (id:number): Promise<any> => {
      if (runCode) {
        return await future.done
      }
      else {
        return Promise.resolve()
      }

    })
    return currentQueue
  }
}
