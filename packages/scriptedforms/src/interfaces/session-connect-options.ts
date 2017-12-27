import {
  ServiceManager
} from '@jupyterlab/services';

export
interface SessionConnectOptions {
  serviceManager: ServiceManager;
  path?: string;
}
