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

import { ScriptedFormsModule } from '../../scripted-forms/scripted-forms.module';
import { KernelService } from '../../scripted-forms/kernel.service'
import { StartComponent } from '../../scripted-forms/start/start.component';
import { VariableComponent } from '../../scripted-forms/variable/variable.component';
import { LiveComponent } from '../../scripted-forms/live/live.component';
import { ButtonComponent } from '../../scripted-forms/button/button.component';

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
        },
        'Cmd-Right': 'goLineRight',
        'End': 'goLineRight',
        'Cmd-Left': 'goLineLeft',
        'Tab': 'indentMore',
        'Shift-Tab': 'indentLess',
        'Cmd-Alt-[': 'indentAuto',
        'Ctrl-Alt-[': 'indentAuto',
        'Cmd-/': 'toggleComment',
        'Ctrl-/': 'toggleComment',
      },
      smartIndent: true,
      electricChars: true,
      fixedGutter: true,
      dragDrop: true
    })



    this.myCodeMirror.setValue(this.defaultForm)
    this.myCodeMirror.refresh()
    this.myCodeMirror.focus()



    Mode.ensure('python').then(() => {
      return Mode.ensure('gfm')
    }).then(() => {
      this.myMarkdownIt = new MarkdownIt({
        html: true,
        linkify: true,
        typographer: true
      })

      this.updateForm()
    })

  }

  updateForm() {
    let rawMarkdown = this.myCodeMirror.getValue()
    let customTags = rawMarkdown.replace(/\[start\]/g, "\n<jupyter-start>\n"
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

    // console.log(html)


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
      @ViewChildren(StartComponent) startComponents: QueryList<StartComponent>
      @ViewChildren(VariableComponent) variableComponents: QueryList<VariableComponent>
      @ViewChildren(LiveComponent) liveComponents: QueryList<LiveComponent>
      @ViewChildren(ButtonComponent) buttonComponents: QueryList<ButtonComponent>


      constructor(
        private myKernelSevice: KernelService,
      ) { }

      ngOnInit() {
        this.myKernelSevice.startKernel()
      }

      ngOnDestroy() {
        this.myKernelSevice.forceShutdownKernel()
      }

      ngAfterViewInit() {
        this.initialiseForm()
      }

      initialiseForm(){
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
    };

    @NgModule(
      {
        imports: [
          CommonModule,
          ScriptedFormsModule
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
