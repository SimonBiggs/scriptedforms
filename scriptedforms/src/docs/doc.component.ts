import { Component } from '@angular/core';

const htmlTemplate = <string>require('html-loader!./doc.component.html');

@Component({
  selector: 'doc-root',
  template: htmlTemplate
})
export class DocComponent {
  constructor(
  ) {}
}
