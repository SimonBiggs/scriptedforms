// scriptedforms
// Copyright (C) 2017 Simon Biggs

// Licensed under both the Apache License, Version 2.0 (the "Apache-2.0") and 
// GNU Affrero General Public License as published by the Free Software 
// Foundation, either version 3 of the License, or (at your option) any later 
// version (the "AGPL-3.0+").

// You may not use this file except in compliance with both the Apache-2.0 AND 
// the AGPL-3.0+ in combination (the "Combined Licenses").

// You may obtain a copy of the AGPL-3.0+ at

//     https://www.gnu.org/licenses/agpl-3.0.txt

// You may obtain a copy of the Apache-2.0 at 

//     https://www.apache.org/licenses/LICENSE-2.0.html

// Unless required by applicable law or agreed to in writing, software
// distributed under the Combined Licenses is distributed on an "AS IS" BASIS, 
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See 
// the Combined Licenses for the specific language governing permissions and 
// limitations under the Combined Licenses.



/*
The Form Component has a function `setFormContents` which is callable on this
component with a string input. Once this function is called the form rebuilds
with the provided contents.
*/

import {
  Component, OnInit, AfterViewInit,
  ViewChild, ViewContainerRef, ComponentRef,
  Compiler, ElementRef
} from '@angular/core';


import * as  MarkdownIt from 'markdown-it';

import { createFormComponentFactory, IFormComponent } from './create-form-component-factory';

// import { FormService } from '../services/form.service';
import { FileService } from '../services/file.service';
import { WatchdogService } from '../services/watchdog.service';

import {
  PromiseDelegate
} from '@phosphor/coreutils';

@Component({
  selector: 'app-form-builder',
  template: `<div class="form-contents"><div #errorbox class="errorbox"></div><div #container></div></div>`
})
export class FormBuilderComponent implements OnInit, AfterViewInit {
  myMarkdownIt: MarkdownIt.MarkdownIt;
  viewInitialised = new PromiseDelegate<void>();

  @ViewChild('errorbox') errorbox: ElementRef;
  @ViewChild('container', { read: ViewContainerRef })
  container: ViewContainerRef;

  errorboxDiv: HTMLDivElement;

  private formComponentRef: ComponentRef<IFormComponent>;

  constructor(
    private compiler: Compiler,
    // private myFormService: FormService,
    private myWatchdogService: WatchdogService,
    private myFileService: FileService
  ) { }

  ngOnInit() {
    this.myMarkdownIt = new MarkdownIt({
      html: true,
      linkify: true,
      typographer: true
    });
  }

  ngAfterViewInit() {
    this.errorboxDiv = this.errorbox.nativeElement;
    this.viewInitialised.resolve(null);
  }

  /**
   * Set or update the template of the form.
   * 
   * This function makes sure to only begin building the form once the component
   * has sufficiently initialised.
   */
  public buildForm(sessionId: string, markdownTemplate: string): Promise<IFormComponent> {
    return this.viewInitialised.promise.then(() => {
      const convertedTemplate = this.convertTemplate(markdownTemplate);
      const htmlTemplate = convertedTemplate['htmlTemplate']
      const cssStyles = convertedTemplate['cssStyles']

      // Create the form component
      let formComponent = this.createFormFromTemplate(sessionId, htmlTemplate, cssStyles)
      
      return formComponent.formViewInitialised.promise.then(() => {
        this.myFileService.renderComplete.resolve(null);
        return formComponent
      })
    });
  }

  stripStyleTags(html: string) {
    let tmp = document.createElement("div");
    tmp.innerHTML = html;
    let cssStyleNodes = Array.from(tmp.getElementsByTagName('style'));
    let cssStyles: string[] = []

    cssStyleNodes.forEach(node => {
      cssStyles = cssStyles.concat([node.innerHTML])
    })

    tmp.remove()
    return cssStyles
  }

  /**
   * Convert the form template from markdown to its final html state.
   * 
   * @param markdownTemplate The markdown template.
   * 
   * @returns The html template.
   */
  private convertTemplate(markdownTemplate: string) {
    // Add new lines around the sections
    const addNewLines = markdownTemplate
    .replace(/<\/?section-.+>/g, match => '\n' + match + '\n')

    // Render the markdown to html
    const html = this.myMarkdownIt.render(addNewLines);



    let cssStyles: string[] = this.stripStyleTags(html)

    // Escape '{}' characters as these are special characters within Angular
    const escapedHtml = html.replace(/{/g, '@~lb~@'
    ).replace(/}/g, '@~rb~@'
    ).replace(/@~lb~@/g, '{{ "{" }}'
    ).replace(/@~rb~@/g, '{{ "}" }}');

    const htmlTemplate = escapedHtml
    const result = {
      htmlTemplate, cssStyles}
    return result
  }

  /**
   * Create the form component from the html template with the Angular compiler.
   * 
   * @param template The html Angular component template
   */
  private createFormFromTemplate(sessionId: string, template: string, cssStyles: string[]): IFormComponent {
    const metadata = {
      selector: `app-form`,
      template: template,
      styles: cssStyles
    };

    // console.log(metadata)

    // Create the form component factory
    const formFactory = createFormComponentFactory(sessionId, this.compiler, metadata);

    // If a form already exists remove it before continuing
    if (this.formComponentRef) {
      this.formComponentRef.destroy();
    }

    // If a previous compile produced an error, clear the error message
    this.errorboxDiv.innerHTML = '';

    // Create the form component
    this.formComponentRef = this.container.createComponent(formFactory);
    this.formComponentRef.instance.formReady.promise.then(() => {
      this.myWatchdogService.formFirstPassComplete.resolve(null)
    })
    return this.formComponentRef.instance
  }
}
