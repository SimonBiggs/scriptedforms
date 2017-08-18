import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ViewContainerRef, ComponentRef,
  Compiler, ComponentFactory, NgModule,
  ModuleWithComponentFactories, ComponentFactoryResolver,
  isDevMode, ElementRef, ViewChildren, QueryList,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import * as  MarkdownIt from 'markdown-it';

import { Mode } from '@jupyterlab/codemirror';

import { FormWidgetsModule } from '../form-widgets.module';
import { KernelService } from '../kernel.service'
import { StartComponent } from '../start/start.component';
import { VariableComponent } from '../variable/variable.component';
import { LiveComponent } from '../live/live.component';
import { ButtonComponent } from '../button/button.component';

interface IRuntimeComponent {
  initialiseForm: Function
}

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit, AfterViewInit {

  myMarkdownIt: MarkdownIt.MarkdownIt

  codeMirrorLoaded: Promise<any>
  viewInitialised: boolean = false

  formContents: string

  // @ViewChild('errorbox') errorbox: ElementRef
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  private componentRef: ComponentRef<IRuntimeComponent>;

  constructor(
    private componentFactoryResolver: ComponentFactoryResolver,
    private compiler: Compiler,
    private myKernelSevice: KernelService,
  ) { }

  ngOnInit() {
    this.codeMirrorLoaded = Mode.ensure('python').then(() => {
        return Mode.ensure('gfm')
      })

    this.myMarkdownIt = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    })
  }

  ngAfterViewInit() {
    this.viewInitialised = true
    if (this.formContents != undefined) {
      this.buildForm(this.formContents)
    }
  }

  setFormContents(form: string) {
    if (this.viewInitialised) {
      this.buildForm(form)
    }

    this.formContents = form
  }

  buildForm(form: string) {
    let customTags = form.replace(/\[start\]/g, "\n<jupyter-start>\n"
    ).replace(/\[\/start\]/g, "\n</jupyter-start>\n"
    ).replace(/\[live\]/g, "\n<jupyter-live>\n"
    ).replace(/\[\/live\]/g, "\n</jupyter-live>\n"
    ).replace(/\[button\]/g, "\n<jupyter-button>\n"
    ).replace(/\[\/button\]/g, "\n</jupyter-button>\n"
    ).replace(/\[number\]/g, '<jupyter-variable type="number">'
    ).replace(/\[\/number\]/g, '</jupyter-variable>'
    ).replace(/\[string\]/g, '<jupyter-variable type="string">'
    ).replace(/\[\/string\]/g, "</jupyter-variable>")

    let html = this.myMarkdownIt.render(customTags)
    let escapedHtml = html.replace(/{/g, "@~lb~@"
    ).replace(/}/g, "@~rb~@"
    ).replace(/@~lb~@/g, "{{ '{' }}"
    ).replace(/@~rb~@/g, "{{ '}' }}");

    this.compileTemplate(escapedHtml)
  }

  compileTemplate(template: string) {
    let metadata = {
      selector: `app-runtime`,
      template: template
    };

    let factory = this.createComponentFactory(
      this.compiler, metadata, null);

    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.componentRef = this.container.createComponent(factory);

    // this.errorbox.nativeElement.innerHTML = ""
  }

  activateForm() {
    this.componentRef.instance.initialiseForm()
  }

  private createComponentFactory(compiler: Compiler, metadata: Component,
                                 componentClass: any): ComponentFactory<any> {
    @Component(metadata)
    class RuntimeComponent implements OnInit, OnDestroy, AfterViewInit {
      formActivation: boolean = false

      @ViewChildren(StartComponent) startComponents: QueryList<StartComponent>
      @ViewChildren(VariableComponent) variableComponents: QueryList<VariableComponent>
      @ViewChildren(LiveComponent) liveComponents: QueryList<LiveComponent>
      @ViewChildren(ButtonComponent) buttonComponents: QueryList<ButtonComponent>


      constructor(
        private myKernelSevice: KernelService,
      ) { }

      ngOnInit() {
        // this.myKernelSevice.startKernel()
      }

      ngOnDestroy() {
        // this.myKernelSevice.forceShutdownKernel()
        if (this.formActivation) {
          this.myKernelSevice.shutdownKernel()
        }
      }

      ngAfterViewInit() {
        // this.initialiseForm()
      }

      initialiseForm(){
        if (this.formActivation == false) {
          this.myKernelSevice.startKernel()
          this.formActivation = true

          // The order here forces all import components to run first.
          // Only then will the variable component fetch the variables.
          this.startComponents.toArray().forEach((startComponent, index) => {
            startComponent.setId(index)
            startComponent.runCode()
          })
          for (let variableComponent of this.variableComponents.toArray()) {
            variableComponent.fetchVariable()
          }
          this.myKernelSevice.queue.then(() => {
            this.liveComponents.toArray().forEach((liveComponent, index) => {
              liveComponent.setId(index)
              liveComponent.formReady()
            })

            for (let variableComponent of this.variableComponents.toArray()) {
              variableComponent.formReady()
            }

            this.buttonComponents.toArray().forEach((buttonComponent, index) => {
              buttonComponent.setId(index)
              buttonComponent.formReady()
            })
          })
        }

      }
    };

    @NgModule(
      {
        imports: [
          CommonModule,
          FormWidgetsModule
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
