import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the {{ cookiecutter.extension_name }} extension.
 */
const extension: JupyterLabPlugin<void> = {
  id: '{{ cookiecutter.extension_name }}',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension {{ cookiecutter.extension_name }} is activated!');
  }
};

export default extension;
