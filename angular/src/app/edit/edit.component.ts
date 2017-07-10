import { 
    Component, OnInit, AfterViewInit, OnDestroy,
    ViewChild, ViewContainerRef, ComponentRef,
    Compiler, ComponentFactory, NgModule, 
    ModuleWithComponentFactories, ComponentFactoryResolver,
    isDevMode, ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import * as  MarkdownIt from 'markdown-it';

import * as ace from 'brace';
import 'brace/mode/markdown';

import { JupyterModule } from '../jupyter/jupyter.module';
import { KernelService } from '../jupyter/kernel.service'

import { TitleService } from '../title.service'


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit, OnDestroy {
  defaultForm = `
    import numpy as np
    import matplotlib.pyplot as plt
    %matplotlib inline


# Title

Edit the text box on the left. 
Press "Ctrl + Enter" to update the preview. \`a = 1\`

    b = 2
    c = 3
    d = 4

<!--<variable>a</variable>-->
<!--<variable>b</variable>-->
<!--<variable>c</variable>-->
<!--<variable>d</variable>-->

    result = np.mean([a, b, c, d])

<!--<print>result</print>-->
<!--<show>plt.plot([a, b], [c, d])</show>-->

    np.linspace(0, 1, 5)

More text

 * A list
 * More
 * Third

Weird

    an_error 

`


  myAce: ace.Editor;

  @ViewChild('editor') editor
  @ViewChild('errorbox') errorbox: ElementRef
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
    private compiler: Compiler,
    private myKernelSevice: KernelService
  ) { }

  ngOnInit() {
    this.myTitleService.set('Create and Edit Forms')
    // this.myKernelSevice.startKernel()
  }

  ngOnDestroy() {
    // this.myKernelSevice.shutdownKernel()
  }

  ngAfterViewInit() {
    this.myAce = ace.edit(this.editor.nativeElement)
    this.myAce.getSession().setMode('ace/mode/markdown')

    this.myAce.commands.addCommand({
      name: "save", bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
      exec: () => {
        this.updateForm()
      }
    })

    this.myAce.setValue(this.defaultForm)
    this.updateForm()

    // this.myAce.on('change', () => {
    //   this.updateForm()
    // })
  }

  updateForm() {
    this.compileTemplate(this.myAce.getValue())
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
    // this.myKernelSevice.shutdownKernel()
    this.componentRef = this.container.createComponent(factory);

    this.errorbox.nativeElement.innerHTML = ""

  }

  private createComponentFactory(compiler: Compiler, metadata: Component, 
                                 componentClass: any): ComponentFactory<any> {
    @Component(metadata)                
    class RuntimeComponent implements OnInit, OnDestroy {
      constructor(
        private myKernelSevice: KernelService
      ) { }

      ngOnInit() {
        this.myKernelSevice.startKernel()
      }
      
      ngOnDestroy() {
        this.myKernelSevice.shutdownKernel()
      }
    };

    @NgModule(
      { 
        imports: [
          CommonModule,
          JupyterModule
        ],
        declarations: [
          RuntimeComponent
        ] 
      }
    )
    class RuntimeComponentModule { }

    let module: ModuleWithComponentFactories<any> = (
      compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule));
    return module.componentFactories.find(
      f => f.componentType === RuntimeComponent);
  }


}