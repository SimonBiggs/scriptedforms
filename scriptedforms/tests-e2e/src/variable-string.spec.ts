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