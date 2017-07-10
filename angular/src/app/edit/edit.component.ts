import { 
    Component, OnInit, AfterViewInit, OnDestroy,
    ViewChild, ViewContainerRef, ComponentRef,
    Compiler, ComponentFactory, NgModule, 
    ModuleWithComponentFactories, ComponentFactoryResolver,
    isDevMode
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Kernel, Session, ServerConnection
} from '@jupyterlab/services';

import * as  MarkdownIt from 'markdown-it';

import * as ace from 'brace';
import 'brace/mode/markdown';

import { JupyterModule } from '../jupyter/jupyter.module';

import { TitleService } from '../title.service'


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit, OnDestroy {
  defaultTemplate = `<!--<import>
import numpy as np
import matplotlib.pyplt as plt
%matplotlib inline
</import>-->

# Title

Edit the text box on the left. 
Press \`Ctrl + Enter\` to update the preview.

<!--<input>variable_1</input>-->
<!--<input>variable_2</input>-->
<!--<input>variable_3</input>-->
<!--<input>variable_4</input>-->
<!--<output>np.mean(
    [variable_1, variable_2, variable_3, variable_4])</output>-->
<!--<figure>plt.plot(
    [variable_1, variable_2], [variable_3, variable_4])</figure>-->

<app-code></app-code>

More text

 * A list
 * More
 * Third`

  settings: ServerConnection.ISettings
  options: Session.IOptions
  session: Session.ISession;
  kernel: Kernel.IKernel

  myAce: ace.Editor;

  @ViewChild('editor') editor
  @ViewChild('errorbox') errorbox
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  private componentRef: ComponentRef<{}>;

  private myMarkdownIt = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true
  })

  constructor(
    private myTitleService: TitleService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private compiler: Compiler
  ) { }

  ngOnInit() {
    this.myTitleService.set('Create and Edit Forms');

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
      this.kernel = kernel;
    }).catch(err => {
      if (err.xhr.status == 403) {
        window.location.pathname = '/login'
      }
      console.error(err);
    });
  }

  ngOnDestroy() {
    this.kernel.shutdown()
  }

  ngAfterViewInit() {
    this.myAce = ace.edit(this.editor.nativeElement)
    this.myAce.getSession().setMode('ace/mode/markdown')

    this.myAce.commands.addCommand({
      name: "save", bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
      exec: () => {
        this.compileTemplate(this.myAce.getValue())
      }
    })

    this.myAce.setValue(this.defaultTemplate)
    this.compileTemplate(this.myAce.getValue())

    // this.myAce.on('change', () => {
    //   this.compileTemplate(this.myAce.getValue())
    // })
  }


  compileTemplate(template: string) {
    let metadata = {
      selector: `app-runtime`,
      template: this.myMarkdownIt.render(template)
    };

    let factory = this.createComponentFactory(
      this.compiler, metadata, null);
    
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.componentRef = this.container.createComponent(factory);

    console.log(this.errorbox.nativeElement.innerHTML = "")

  }

  private createComponentFactory(compiler: Compiler, metadata: Component, 
                                 componentClass: any): ComponentFactory<any> {
                                   
    const cmpClass = componentClass || class RuntimeComponent {};
    const decoratedCmp = Component(metadata)(cmpClass);

    @NgModule(
      { 
        imports: [
          CommonModule,
          JupyterModule
        ],
        declarations: [
          decoratedCmp
        ] 
      }
    )
    class RuntimeComponentModule { }

    let module: ModuleWithComponentFactories<any> = (
      compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule));
    return module.componentFactories.find(
      f => f.componentType === decoratedCmp);
  }


}