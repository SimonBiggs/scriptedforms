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

import * as ace from 'brace';
import 'brace/mode/markdown';

// import { InputArea } from '@jupyterlab/cells';

import { JupyterModule } from '../jupyter/jupyter.module';
import { KernelService } from '../jupyter/kernel.service'
import { ImportComponent } from '../jupyter/import/import.component';
import { VariableComponent } from '../jupyter/variable/variable.component';
import { LiveComponent } from '../jupyter/live/live.component';

import {
  Mode, CodeMirrorEditor
} from '@jupyterlab/codemirror';

// import { TitleService } from '../title.service'

import { FORMCONTENTS } from './default-form'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit, OnDestroy {
  // inputArea: InputArea

  myMarkdownIt: MarkdownIt.MarkdownIt

  defaultForm = FORMCONTENTS

  myAce: ace.Editor;

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
    this.myAce = ace.edit(this.editor.nativeElement)
    this.myAce.getSession().setMode('ace/mode/markdown')

    this.myAce.setValue(this.defaultForm)

    Mode.ensure('python').then(() => {
      return Mode.ensure('markdown')
    }).then(() => {
      this.myMarkdownIt = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true
      })

      this.myAce.commands.addCommand({
        name: "save", bindKey: {win: "Ctrl-Enter", mac: "Command-Enter"},
        exec: () => {
          this.updateForm()
        }
      })

      this.updateForm()
    })

  }

  updateForm() {
    let html = this.myMarkdownIt.render(this.myAce.getValue())
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
