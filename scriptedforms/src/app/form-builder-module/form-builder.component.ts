// Scripted Forms -- Making GUIs easy for everyone on your team.
// Copyright (C) 2017 Simon Biggs

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     http://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.



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
  template: `
<div class="form-contents"><ng-content></ng-content>
  <div #errorbox class="errorbox"></div>
  <div #container></div>
</div>
<iframe #telemetry class="hidden-iframe"></iframe>
`
})
export class FormBuilderComponent implements OnInit, AfterViewInit {
  myMarkdownIt: MarkdownIt.MarkdownIt;
  viewInitialised = new PromiseDelegate<void>();

  @ViewChild('errorbox') errorbox: ElementRef<HTMLDivElement>;
  @ViewChild('telemetry') telemetry: ElementRef<HTMLIFrameElement>;
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
      typographer: true,
    });
    this.myMarkdownIt.disable('code');
  }

  ngAfterViewInit() {
    this.errorboxDiv = this.errorbox.nativeElement;
    this.viewInitialised.resolve(null);
  }

  // https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
  private _setUsageStatistics(string: string) {
    if (string) {
      const url = new URL(location.href);
      const telemetry = url.searchParams.get('telemetry');
      if (telemetry !== '0') {
        crypto.subtle.digest('SHA-256', Buffer.from(string)).then((hash) => {
          const intArrayHash = new Uint8Array(hash);
          const base64String = btoa(String.fromCharCode.apply(null, intArrayHash));
          const uriEncoded = encodeURIComponent(base64String);
          this.telemetry.nativeElement.src = `https://scriptedforms.com.au/telemetry?hash=${uriEncoded}`;
        });
      } else {
        console.log('telemetry blocked using ?telemetry=0');
      }
    }
  }

  /**
   * Set or update the template of the form.
   *
   * This function makes sure to only begin building the form once the component
   * has sufficiently initialised.
   */
  public buildForm(markdownTemplate: string): Promise<IFormComponent> {
    this._setUsageStatistics(markdownTemplate);
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
