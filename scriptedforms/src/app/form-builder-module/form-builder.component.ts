// Scripted Forms -- Making GUIs easy for everyone on your team.
// Copyright (C) 2017 Simon Biggs

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version (the "AGPL-3.0+").

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU Affero General Public License and the additional terms for more
// details.

// You should have received a copy of the GNU Affero General Public License
// along with this program. If not, see <http://www.gnu.org/licenses/>.

// ADDITIONAL TERMS are also included as allowed by Section 7 of the GNU
// Affrero General Public License. These aditional terms are Sections 1, 5,
// 6, 7, 8, and 9 from the Apache License, Version 2.0 (the "Apache-2.0")
// where all references to the definition "License" are instead defined to
// mean the AGPL-3.0+.

// You should have received a copy of the Apache-2.0 along with this
// program. If not, see <http://www.apache.org/licenses/LICENSE-2.0>.



/*
The Form Component has a function `setFormContents` which is callable on this
component with a string input. Once this function is called the form rebuilds
with the provided contents.
*/

import {
  Component, OnInit, AfterViewInit, ViewChild, ViewContainerRef, ComponentRef,
  Compiler, ElementRef
} from '@angular/core';

import { PromiseDelegate } from '@phosphor/coreutils';

declare var MathJax: any;
import * as  MarkdownIt from 'markdown-it';

import { FileService } from '../services/file.service';

import { createFormComponentFactory, IFormComponent } from './create-form-component-factory';


@Component({
  selector: 'app-form-builder',
  template: `<div class="form-contents"><ng-content></ng-content><div #errorbox class="errorbox"></div><div #container></div></div>`
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
    // private myWatchdogService: WatchdogService,
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
  public buildForm(markdownTemplate: string): Promise<IFormComponent> {
    return this.viewInitialised.promise.then(() => {
      const convertedTemplate = this.convertTemplate(markdownTemplate);
      const htmlTemplate = convertedTemplate['htmlTemplate'];
      const cssStyles = convertedTemplate['cssStyles'];

      // Create the form component
      const formComponent = this.createFormFromTemplate(htmlTemplate, cssStyles);

      return formComponent.formViewInitialised.promise.then(() => {
        this.myFileService.renderComplete.resolve(null);
        return formComponent;
      });
    });
  }

  stripStyleTags(html: string) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    const cssStyleNodes = Array.from(tmp.getElementsByTagName('style'));
    let cssStyles: string[] = [];

    cssStyleNodes.forEach(node => {
      cssStyles = cssStyles.concat([node.innerHTML]);
    });

    tmp.remove();
    return cssStyles;
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
    .replace(/<\/?section-.+>/g, match => '\n' + match + '\n');

    // Render the markdown to html
    const html = this.myMarkdownIt.render(addNewLines);

    const cssStyles: string[] = this.stripStyleTags(html);
    const userStyle = document.getElementById('scripted-forms-custom-user-style');
    userStyle.innerHTML = cssStyles.join('\n\n');

    // Escape '{}' characters as these are special characters within Angular
    const escapedHtml = html.replace(/{/g, '@~lb~@'
    ).replace(/}/g, '@~rb~@'
    ).replace(/@~lb~@/g, '{{ \'{\' }}'
    ).replace(/@~rb~@/g, '{{ \'}\' }}');

    const htmlTemplate = escapedHtml;
    const result = {
      htmlTemplate, cssStyles
    };
    return result;
  }

  /**
   * Create the form component from the html template with the Angular compiler.
   *
   * @param template The html Angular component template
   */
  private createFormFromTemplate(template: string, cssStyles: string[]): IFormComponent {
    const metadata = {
      selector: `app-form`,
      template: template,
      styles: cssStyles
    };

    // Create the form component factory
    const formFactory = createFormComponentFactory(this.compiler, metadata);

    // If a form already exists remove it before continuing
    if (this.formComponentRef) {
      this.formComponentRef.destroy();
    }

    // If a previous compile produced an error, clear the error message
    this.errorboxDiv.innerHTML = '';

    // Create the form component
    this.formComponentRef = this.container.createComponent(formFactory);
    if (typeof MathJax !== 'undefined') {
      this.formComponentRef.instance.formReady.promise.then(() => {
        MathJax.Hub.Queue(['Typeset', MathJax.Hub]);
      });
    }
    return this.formComponentRef.instance;
  }
}
