import { Component } from '@angular/core';

import * as htmlTemplate from 'html-loader!./doc.component.html';
const template = '' + htmlTemplate;

@Component({
  selector: 'doc-root',
  template: template
})
export class DocComponent {
  constructor(
  ) {}
}
