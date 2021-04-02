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
  expect(secondString.getAttribute('value')).toEqual(text)

  browser.wait(ExpectedConditions.presenceOf(resultContents))
  expect(resultContents.getText()).toEqual(text)

  sendKeysInto(secondString)
  waitForSpinner()
  expect(firstString.getAttribute('value')).toEqual(text + text)

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