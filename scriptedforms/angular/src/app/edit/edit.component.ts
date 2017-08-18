import {
    Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef, ElementRef
} from '@angular/core';

import * as CodeMirror
  from 'codemirror';

import { ScriptedFormsModule } from '../scripted-forms/scripted-forms.module';
import { FormComponent } from '../scripted-forms/form/form.component';

import { Mode } from '@jupyterlab/codemirror';

import { FORMCONTENTS } from './default-form'

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, AfterViewInit {

  defaultForm = FORMCONTENTS

  renderQueueId = 0;
  renderQueue: Promise<any> = Promise.resolve()

  myCodeMirror: CodeMirror.Editor;

  @ViewChild('errorbox') errorbox: ElementRef
  @ViewChild('form') formComponent: FormComponent
  @ViewChild('editor') editor

  constructor(
    // private myTitleService: TitleService,
    private myChangeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // this.myTitleService.set(null)
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
          this.activateForm()
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

    this.formComponent.setFormContents(this.myCodeMirror.getValue())
    this.myChangeDetectorRef.detectChanges()

    // CodeMirror.on(this.myCodeMirror, "change")
    this.myCodeMirror.on("changes", () => {
      this.codeMirrorChange()
    })
  }

  async codeMirrorChange() {
    this.throttledFormUpdate()
  }

  updateForm() {
    this.errorbox.nativeElement.innerHTML = ""
    this.formComponent.setFormContents(this.myCodeMirror.getValue())
  }

  activateForm() {
    this.formComponent.activateForm()
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  throttledFormUpdate() {
    this.addToRenderQueue(async (id) => {
      if (id == this.renderQueueId) {
        await this.sleep(300)
        if (id == this.renderQueueId) {
          this.updateForm()
        }
      }  
      return Promise.resolve()

    })
  }

  addToRenderQueue(asyncFunction:(id: number) => Promise<any>): Promise<any>{
    this.renderQueueId += 1
    const currentQueueId = this.renderQueueId

    const previous = this.renderQueue
    return this.renderQueue = (async () => {
      await previous;
      return asyncFunction(currentQueueId).catch((err) => {
        this.errorbox.nativeElement.innerHTML = err
        return Promise.resolve()
      });
    })();
  }

}
