import {
    Component, OnInit, AfterViewInit, OnDestroy,
    ViewChild, ViewContainerRef, ComponentRef,
    Compiler, ComponentFactory, NgModule,
    ModuleWithComponentFactories, ComponentFactoryResolver,
    isDevMode, ElementRef, ViewChildren, QueryList
} from '@angular/core';

import { CommonModule } from '@angular/common';

import * as  MarkdownIt from 'markdown-it';

import * as ace from 'brace';
import 'brace/mode/markdown';

import { JupyterModule } from '../jupyter/jupyter.module';
import { KernelService } from '../jupyter/kernel.service'
import { ImportComponent } from '../jupyter/import/import.component';
import { VariableComponent } from '../jupyter/variable/variable.component';
import { LiveComponent } from '../jupyter/live/live.component';

import { TitleService } from '../title.service'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit, OnDestroy {
  defaultForm = `
Import should always run when the Kernel is started up.

<import>

    import time
    import numpy as np
    import matplotlib.pyplot as plt
    %matplotlib inline

</import>

# Title

Edit the text box on the left.
Press "Ctrl + Enter" to update the preview.

<import>

    a = 5
    b = np.nan
    c = np.nan
    d = np.nan

<import>


Live will run and re-run whenever one of the input boxes is changed.

<live>

Use a try except (or better test if variable exists, not try...) code send to
the kernel to read the current state of the input
variables. Display the current value of the input value in the input box if
python says it has one.

<variable type="number">a</variable>
<variable type="number">b</variable>
<variable type="number">c</variable>
<variable type="number">d</variable>

    result = np.nanmean([a, b, c, d])
    print(result)

</live>

Variable tags are always called first within live groups.

<live>

    x = np.linspace(-10, 10)
    y = x ** power

Power Value: <variable type="number">power</variable>

    plt.plot(x, y)

</live>

<import>

Import groups always run before all other groups.

    power = 1

</import>

Wait groups will not run initially, they will only run when their respective
button is pressed.

<wait>

    np.linspace(0, 1, 5)

</wait>

More text

 * A list
 * More
 * Third

Weird

Need to think of a way to allow intermittent prints to display... Need to be
able to pass the future to the code component while still have the queue wait
till the code is complete.

<wait>

    print("Start Sleep")
    time.sleep(10)
    print("Finish Sleep")

</wait>

Test

<wait>

    an_error

</wait>


Make a button permanently down here that when clicked it force kills the
server. This should make the queue now finish quite quickly. The item of
starting back up the kernel should still be placed on the queue, but it should
resest quite quickly. After the reset all code from top to bottom is to be run.
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
    this.myTitleService.set(null)
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
    class RuntimeComponent implements OnInit, OnDestroy, AfterViewInit {
      @ViewChildren(ImportComponent) importComponents: QueryList<ImportComponent>
      @ViewChildren(VariableComponent) variableComponents: QueryList<VariableComponent>
      @ViewChildren(LiveComponent) liveComponents: QueryList<LiveComponent>


      constructor(
        private myKernelSevice: KernelService
      ) { }

      ngOnInit() {
        this.myKernelSevice.startKernel()
      }

      ngOnDestroy() {
        this.myKernelSevice.shutdownKernel()
      }

      ngAfterViewInit() {
        // The order here forces all import components to run first.
        // Only then will the variable component fetch the variables.
        for (let importComponent of this.importComponents.toArray()) {
          importComponent.runCode()
        }
        for (let variableComponent of this.variableComponents.toArray()) {
          variableComponent.fetchVariable()
        }
        this.myKernelSevice.queue.then(() => {
          for (let liveComponent of this.liveComponents.toArray()) {
            liveComponent.formReady()
          }
        })
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
