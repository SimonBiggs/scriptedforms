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
  browser, element, by, ExpectedConditions
} from 'protractor';

import { beforeFromFile, after, waitForSpinner } from './utilities/before-and-after'

const TEMPLATE_FILE = 'section-button.md'

describe(TEMPLATE_FILE, () => {
  beforeEach(beforeFromFile(TEMPLATE_FILE));
  afterEach(after())

  it('should run on click', () => {
    let runningButton = element(by.css('.check-my-running button'))
    browser.wait(ExpectedConditions.elementToBeClickable(runningButton))

    let initialOutput = element.all(by.css('.check-my-running .jp-OutputArea-output'))
    expect(initialOutput.count()).toEqual(0)

    runningButton.click()
    let outputArea = element(by.css('.check-my-running .jp-OutputArea-output'))
    browser.wait(ExpectedConditions.presenceOf(outputArea))

    let text = element(by.tagName('h1')).getText()
    expect(text).toEqual('Hello')
  })

  it('should be able to be named', () => {
    let namedButtonLabel = element(by.css('.check-my-name button span'))
    expect(namedButtonLabel.getText()).toEqual('foo')
  })

  it('should honour conditional', () => {
    let disableButton = element(by.css('.make-false button'))
    let enableButton = element(by.css('.make-true button'))

    browser.wait(ExpectedConditions.elementToBeClickable(disableButton))
    browser.wait(ExpectedConditions.elementToBeClickable(enableButton))

    let conditionalButton = element(by.css('.check-my-conditional button'))
    expect(conditionalButton.isEnabled()).toBe(false)

    enableButton.click()
    waitForSpinner()
    expect(conditionalButton.isEnabled()).toBe(true)

    disableButton.click()
    waitForSpinner()
    expect(conditionalButton.isEnabled()).toBe(false)
  })
});