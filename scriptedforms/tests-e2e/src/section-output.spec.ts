import {
  browser, element, by, ExpectedConditions
} from 'protractor';

import { beforeFromFile, after, waitForSpinner } from './utilities/before-and-after'

const TEMPLATE_FILE = 'section-output.md'

describe(TEMPLATE_FILE, () => {
  beforeEach(beforeFromFile(TEMPLATE_FILE));
  afterEach(after())

  it('should run when variables are changed', () => {
    let outputContents = element(by.css('.check-me-running .jp-OutputArea-output pre'))
    browser.wait(ExpectedConditions.presenceOf(outputContents))
    expect(outputContents.getText()).toEqual('foo: , bar: 0')

    let fooString = element(by.css('.write-in-me textarea'))
    fooString.sendKeys('boo')

    waitForSpinner()
    expect(outputContents.getText()).toEqual('foo: boo, bar: 0')

    let adderButton = element(by.css('.click-me button'))
    adderButton.click()
    waitForSpinner()
    expect(outputContents.getText()).toEqual('foo: boo, bar: 1')
  })
});