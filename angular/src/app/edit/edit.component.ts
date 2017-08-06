import {
    Component, OnInit, AfterViewInit, OnDestroy,
    ViewChild, ViewContainerRef, ComponentRef,
    Compiler, ComponentFactory, NgModule,
    ModuleWithComponentFactories, ComponentFactoryResolver,
    isDevMode, ElementRef, ViewChildren, QueryList,
    ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  RenderMime, defaultRendererFactories, IRenderMime, MimeModel
} from '@jupyterlab/rendermime';
import { renderMarkdown } from '@jupyterlab/rendermime';

import { OutputArea, OutputAreaModel } from '@jupyterlab/outputarea';
// import {  } from '@jupyterlab/cells';

import { ISanitizer } from '@jupyterlab/apputils';

import * as  MarkdownIt from 'markdown-it';

import * as marked from 'marked';

import * as ace from 'brace';
import 'brace/mode/markdown';

import { InputArea } from '@jupyterlab/cells';

import { JupyterModule } from '../jupyter/jupyter.module';
import { KernelService } from '../jupyter/kernel.service'
import { ImportComponent } from '../jupyter/import/import.component';
import { VariableComponent } from '../jupyter/variable/variable.component';
import { LiveComponent } from '../jupyter/live/live.component';

// import { TitleService } from '../title.service'

import { FORMCONTENTS } from './default-form'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit, OnDestroy {
  inputArea: InputArea
  renderMime: RenderMime
  renderer: IRenderMime.IRenderer
  // mimeModel: MimeModel

  defaultForm = FORMCONTENTS

  // outputAreaOptions: OutputArea.IOptions
  // outputArea: OutputArea
  // model: OutputAreaModel

  // nullSanitizer: ISanitizer

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
    // private myTitleService: TitleService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private compiler: Compiler,
    private myKernelSevice: KernelService,
    private myChangeDetectorRef: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    // this.inputArea = new InputArea({

    // })

    this.renderMime = new RenderMime(
      { initialFactories: defaultRendererFactories });

    this.renderer = this.renderMime.createRenderer('text/markdown');

    // this.model = new OutputAreaModel()
    // this.renderMime = new RenderMime(
    //   { initialFactories: defaultRendererFactories });

    // this.outputAreaOptions = {
    //   model: this.model,
    //   rendermime: this.renderMime
    // }

    // this.outputArea = new OutputArea(this.outputAreaOptions)

    // this.outputArea.
    // this.myTitleService.set(null)
  }

  ngOnDestroy() {
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
  }

  updateForm() {
    let mimeModel = new MimeModel(
      { data: { 'text/markdown': this.myAce.getValue() }});
    this.renderer.renderModel(mimeModel)

    this.renderer.renderModel(mimeModel).then(result => {
      this.compileTemplate(this.renderer.node.innerHTML)
      this.myChangeDetectorRef.detectChanges()
    })
    // this.nullSanitizer = {
    //   sanitize: (value: string) => {return value}
    // }

    // let node = document.createElement("div");
    // renderMarkdown({
    //   host: node,
    //   source: this.myAce.getValue(),
    //   trusted: true,
    //   sanitizer: this.nullSanitizer,
    //   resolver: null,
    //   linkHandler: null,
    //   shouldTypeset: true
    // }).then(() => {

    // })

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
        private myKernelSevice: KernelService,
        // private myChangeDetectorRef: ChangeDetectorRef
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
