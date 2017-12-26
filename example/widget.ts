import {
  BoxLayout, Widget
} from '@phosphor/widgets';

import {
  ServiceManager
} from '@jupyterlab/services';

import {
  AngularWidget
} from '@simonbiggs/phosphor-angular-loader';

import {
  AppComponent
} from './app.component';

import {
  AppModule
} from './app.module';

import {
  SessionConnectOptions
} from './interfaces/session-connect-options';





export
class FormWidget extends Widget {
  serviceManager: ServiceManager;
  form: AngularWidget<AppComponent, AppModule>

  constructor(options: SessionConnectOptions) {
    super()

    this.addClass('container')

    let layout = this.layout = new BoxLayout();
    this.form = new AngularWidget<AppComponent, AppModule>(AppComponent, AppModule)
    this.form.addClass('form');
    let toolbar = new Widget();
    toolbar.addClass('toolbar');

    layout.addWidget(toolbar);
    BoxLayout.setStretch(toolbar, 0);
    layout.addWidget(this.form);
    BoxLayout.setStretch(this.form, 1);

    this.form.run(() => {
      this.form.componentInstance.sessionConnect(options);
    })
  }
  
  updateTemplate(template: string) {
    this.form.run(() => {
      this.form.componentInstance.modelReady().then(() => {
        this.form.componentInstance.setTemplateAndBuildForm(template);
      })
    });
  }
};