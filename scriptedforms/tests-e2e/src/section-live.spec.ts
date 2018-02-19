import {
  browser, element, by, ExpectedConditions
} from 'protractor';

import { beforeFromFile, after, waitForSpinner } from './utilities/before-and-after'

const TEMPLATE_FILE = 'section-live.md'

describe(TEMPLATE_FILE, () => {
  beforeEach(beforeFromFile(TEMPLATE_FILE));
  afterEach(after())

  it('should run when variables are changed', () => {
    let outputContents = element(by.css('.check-me-running .jp-OutputArea-output pre'))
    browser.wait(ExpectedConditions.presenceOf(outputContents))
    expect(outputContents.getText()).toEqual('bar')

    let fooString = element(by.css('.write-in-me textarea'))
    fooString.sendKeys(' boo')

    waitForSpinner()
    expect(outputContents.getText()).toEqual('bar boo')
  })
});