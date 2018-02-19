import {
  browser, element, by, ExpectedConditions
} from 'protractor';

import { before, after } from './utilities/before-and-after'

const TEMPLATE_FILE = 'landing-page.md'

describe(TEMPLATE_FILE, () => {
  beforeEach(before('http://localhost:8989/'));
  afterEach(after())

  it('should have a heading', () => {
    let header = element(by.tagName('h1'))
    browser.wait(ExpectedConditions.presenceOf(header))
    let text = header.getText()
    expect(text).toEqual('A landing page')
  })
});