import {
  browser, element, by, ExpectedConditions
} from 'protractor';

import { beforeFromFile, after } from './utilities/before-and-after'

const TEMPLATE_FILE = 'section-start.md'

describe(TEMPLATE_FILE, () => {
  beforeEach(beforeFromFile(TEMPLATE_FILE));
  afterEach(after())

  it('should successfully run on start', () => {
    let elem = element(by.css('.check-me .jp-OutputArea-output'))
    browser.wait(ExpectedConditions.presenceOf(elem))

    let text = element(by.tagName('h1')).getText()
    expect(text).toEqual('Hello')
  })
});