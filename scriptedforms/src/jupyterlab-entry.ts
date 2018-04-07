import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

const extension: JupyterLabPlugin<void> = {
  id: 'ScriptedForms',
  autoStart: true,
  activate: (app: JupyterLab) => {
    console.log('JupyterLab extension ScriptedForms is activated boo!');
  }
};

export default extension;
