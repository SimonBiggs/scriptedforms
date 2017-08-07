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

import * as CodeMirror
  from 'codemirror';

import { JupyterModule } from '../jupyter/jupyter.module';
import { KernelService } from '../jupyter/kernel.service'
import { ImportComponent } from '../jupyter/import/import.component';
import { VariableComponent } from '../jupyter/variable/variable.component';
import { LiveComponent } from '../jupyter/live/live.component';

import { Mode } from '@jupyterlab/codemirror';

// import { TitleService } from '../title.service'

import { FORMCONTENTS } from './default-form'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit, OnDestroy {

  myMarkdownIt: MarkdownIt.MarkdownIt

  defaultForm = FORMCONTENTS

  myCodeMirror: CodeMirror.Editor;

  @ViewChild('editor') editor
  @ViewChild('errorbox') errorbox: ElementRef
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  private componentRef: ComponentRef<{}>;



  constructor(
    // private myTitleService: TitleService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private compiler: Compiler,
    private myKernelSevice: KernelService,
    private myChangeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    // this.myTitleService.set(null)
  }

  ngOnDestroy() {
  }

  ngAfterViewInit() {
    this.myCodeMirror = CodeMirror(this.editor.nativeElement, {
      lineNumbers: true,
      mode: "gfm",
      theme: 'jupyter',
      indentUnit: 4,
      lineWrapping: true,
      extraKeys: {
        "Ctrl-Enter": () => {
          this.updateForm()
        }
      }
    })

    this.myCodeMirror.setValue(this.defaultForm)



    Mode.ensure('python').then(() => {
      return Mode.ensure('markdown')
    }).then(() => {
      this.myMarkdownIt = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true
      })

      // CodeMirror.on(this.myCodeMirror, "keydown", (editor, event) => {
      //   console.log(event.keyCode)
      //   if (event.keyCode == 'Ctrl-Enter') {
      //     this.updateForm()
      //   }
      // })


      this.updateForm()
    })

  }

  updateForm() {
    let html = this.myMarkdownIt.render(this.myCodeMirror.getValue())
    let escapedHtml = html.replace(
      /{/g, "@~lb~@").replace(/}/g, "@~rb~@").replace(
        /@~lb~@/g, "{{ '{' }}").replace(/@~rb~@/g, "{{ '}' }}");

    this.compileTemplate(escapedHtml)
    this.myChangeDetectorRef.detectChanges()

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
        private myKernelSevice: KernelService,
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
