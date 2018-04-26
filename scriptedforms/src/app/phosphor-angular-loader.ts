/*
 *  Copyright 2017 Simon Biggs
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *         http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */


import {
  Widget
} from '@phosphor/widgets';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

import {
  ApplicationRef, Type, Injector,
  ComponentFactoryResolver, ComponentRef, NgZone,
  NgModuleRef
} from '@angular/core';

import {
  platformBrowserDynamic
} from '@angular/platform-browser-dynamic';

/*
 *  # Create your own Angular JupyterLab extension (cont.)
 *
 *  This is part of the guide available at
 *  <https://github.com/SimonBiggs/scriptedforms/blob/master/scriptedforms/docs/create-your-own-angular-jupyterlab-extension.md>
 *
 *  ## The Phosphor Wrapper
 *
 *  Angular's default setup is to be in control of the entire page. Usually there isn't anything
 *  around or 'above' Angular. In this case however the non-Angular application
 *  JupyterLab needs to be above it. This means that Angular's default browser
 *  bootstrapping cannot be used. Therefore
 *  [manual bootstrapping](https://blog.angularindepth.com/how-to-manually-bootstrap-an-angular-application-9a36ccf86429)
 *  is required.
 *
 *  Not only that but we want JupyterLab to see a Phoshor Widget, not an Angular
 *  app.
 *
 *  And lastly, anytime JupyterLab does something which impacts the Angular app
 *  that change needs to be wrapped up within [ngZone](https://angular.io/api/core/NgZone)
 *  which kicks off Angular's brilliant change detection.
 *
 *  So that's what this file does. It creates an Angular Loader to bootstrap
 *  the Angular App, and then a Phosphor Widget is created which calls that loader
 *  while also providing a `run()` function for the purpose of passing actions
 *  into Angular's change detecting ngZone.
 */


export class AngularLoader<M> {
  private applicationRef: ApplicationRef;
  private componentFactoryResolver: ComponentFactoryResolver;
  ngZone: NgZone;
  private injector: Injector;

  constructor( ngModuleRef: NgModuleRef<M>) {
    this.injector = ngModuleRef.injector;
    this.applicationRef = this.injector.get(ApplicationRef);
    this.ngZone = this.injector.get(NgZone);
    this.componentFactoryResolver = this.injector.get(ComponentFactoryResolver);
  }

  attachComponent<T>(ngComponent: Type<T>, dom: Element): ComponentRef<T> {
    let componentRef: ComponentRef<T>;
    this.ngZone.run(() => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ngComponent);
      componentRef = componentFactory.create(this.injector, [], dom);
      this.applicationRef.attachView(componentRef.hostView);
    });
    return componentRef;
  }
}

export class AngularWidget<C, M> extends Widget {
  angularLoader: AngularLoader<M>;
  ngZone: NgZone;
  componentRef: ComponentRef<C>;
  componentInstance: C;
  componentReady = new PromiseDelegate<void>();

  constructor(ngComponent: Type<C>, ngModule: Type<M>, options?: Widget.IOptions) {
    super(options);
    platformBrowserDynamic().bootstrapModule(ngModule)
    .then(ngModuleRef => {
      this.angularLoader = new AngularLoader(ngModuleRef);
      this.ngZone = this.angularLoader.ngZone;
      this.componentRef = this.angularLoader.attachComponent(
        ngComponent, this.node);
      this.componentInstance = this.componentRef.instance;
      this.componentReady.resolve(undefined);
    });
  }

  run(func: () => void): void {
    this.componentReady.promise.then(() => {
      this.ngZone.run(func);
    });
  }

  dispose(): void {
    this.ngZone.run(() => {
      this.componentRef.destroy();
    });
    super.dispose();
  }
}
