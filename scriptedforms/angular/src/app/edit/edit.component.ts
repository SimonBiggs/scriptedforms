import {
    Component, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef
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

  myCodeMirror: CodeMirror.Editor;

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
          this.formComponent.setFormContents(this.myCodeMirror.getValue())
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
  }

}
