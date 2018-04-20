import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Widget } from '@phosphor/widgets';

import { ServiceManager, ContentsManager } from '@jupyterlab/services';
import { ScriptedFormsWidget } from '../../app/widget';

import * as htmlTemplate from 'html-loader!./landing-page.component.html';
const template = '' + htmlTemplate;

const aTemplate = `
# Live documentation

There isn't any docs here yet.

Watch this space.

## Available example forms

<section-start always>

~~~python
import urllib.parse
from glob import glob
from IPython.display import display, Markdown
~~~

</section-start>

<section-filechange onLoad paths="['.']">

~~~python
filepaths = glob('*.md') + glob('*/*.md') + glob('*/*/*.md')
for filepath in filepaths:
    escaped_filepath = urllib.parse.quote(filepath)
    display(Markdown('[{}](../use/{})'.format(filepath, escaped_filepath)))
~~~

</section-filechange>
`;


@Component({
  selector: 'app-landing-page',
  template: template
})
export class LandingPageComponent implements AfterViewInit {
  @ViewChild('formWrapper') formWrapper: ElementRef;


  constructor(

  ) {}

  ngAfterViewInit() {
    const serviceManager = new ServiceManager();
    const contentsManager = new ContentsManager();

    const formWidget = new ScriptedFormsWidget({
      serviceManager,
      contentsManager
    });

    formWidget.form.initiliseScriptedForms();

    window.onresize = () => { formWidget.update(); };
    Widget.attach(formWidget, this.formWrapper.nativeElement);

    formWidget.form.setTemplateToString('a_dummy_path', aTemplate);
  }
}
