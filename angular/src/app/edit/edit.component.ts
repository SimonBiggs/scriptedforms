import { 
    Component, OnInit, AfterViewInit,
    ViewChild, ViewContainerRef, ComponentRef,
    Compiler, ComponentFactory, NgModule, ModuleWithComponentFactories, ComponentFactoryResolver
} from '@angular/core';

import { CommonModule } from '@angular/common';

import * as  MarkdownIt from 'markdown-it';

import * as ace from 'brace';
import 'brace/mode/markdown';
// import 'brace/theme/monokai';

import { TitleService } from '../title.service'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit{
  myAce: ace.Editor;

  @ViewChild('editor') editor
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
  }

  ngAfterViewInit() {
    this.myAce = ace.edit(this.editor.nativeElement)
    this.myAce.getSession().setMode('ace/mode/markdown')
    // this.myAce.setTheme('ace/theme/monokai')

    this.myAce.on('change', () => {
      this.compileTemplate(this.myAce.getValue())
    })
  }


  compileTemplate(template: string) {
    let metadata = {
      selector: `app-runtime`,
      template: this.myMarkdownIt.render(template)
    };

    let factory = this.createComponentFactorySync(this.compiler, metadata, null);
    
    if (this.componentRef) {
      this.componentRef.destroy();
      this.componentRef = null;
    }
    this.componentRef = this.container.createComponent(factory);
  }

  private createComponentFactorySync(compiler: Compiler, metadata: Component, componentClass: any): ComponentFactory<any> {
    const cmpClass = componentClass || class RuntimeComponent { 
      
    };
    const decoratedCmp = Component(metadata)(cmpClass);

    @NgModule({ imports: [CommonModule], declarations: [decoratedCmp] })
    class RuntimeComponentModule { }

    let module: ModuleWithComponentFactories<any> = compiler.compileModuleAndAllComponentsSync(RuntimeComponentModule);
    return module.componentFactories.find(f => f.componentType === decoratedCmp);
  }


}