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