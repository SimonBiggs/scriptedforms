import {
  browser, element, by, ExpectedConditions, ElementFinder, Key
} from 'protractor';

import { beforeFromFile, after, waitForSpinner } from './utilities/before-and-after'

const TEMPLATE_FILE = 'variable-string.md'

function writeInBothAndTest(text: string, sendKeysInto?: (elementFinder: ElementFinder) => void) {
  let firstString = element(by.css('.write-in-me-first textarea'))
  let secondString = element(by.css('.write-in-me-second textarea'))

  let resultContents = element(by.css('.see-my-result .jp-OutputArea-output pre'))
  browser.wait(ExpectedConditions.presenceOf(resultContents))
  expect(resultContents.getText()).toEqual('')

  if (!sendKeysInto) {
    sendKeysInto = (elementFinder: ElementFinder) => {
      elementFinder.sendKeys(text)
    }
  }

  sendKeysInto(firstString)
  waitForSpinner()
  expect(secondString.getAttribute('ng-reflect-model')).toEqual(text)

  browser.wait(ExpectedConditions.presenceOf(resultContents))
  expect(resultContents.getText()).toEqual(text)

  sendKeysInto(secondString)
  waitForSpinner()
  expect(firstString.getAttribute('ng-reflect-model')).toEqual(text + text)

  browser.wait(ExpectedConditions.presenceOf(resultContents))
  expect(resultContents.getText()).toEqual(text + text)
}

describe(TEMPLATE_FILE, () => {
  beforeEach(beforeFromFile(TEMPLATE_FILE));
  afterEach(after())

  it('should handle backslash', () => {
    writeInBothAndTest('\\\\\\')
  })

  it('should handle double quotes', () => {
    writeInBothAndTest('""""""')
  })

  it('should handle single quotes', () => {
    writeInBothAndTest("''''''")
  })

  it('should handle new lines', () => {
    let sendKeysInto = (elementFinder: ElementFinder) => {
      elementFinder.sendKeys(
        'foo', Key.ENTER, 'bar', Key.ENTER, 'boo', Key.ENTER, 'hoo')
    }
    writeInBothAndTest('foo\nbar\nboo\nhoo', sendKeysInto)
  })

  it('should handle quotes and backslashes together', () => {
    writeInBothAndTest("\\'\\\"\\\\")
  })

  it('should handle fences', () => {
    writeInBothAndTest("``` ~~~ ``` ~~~")
  })
});