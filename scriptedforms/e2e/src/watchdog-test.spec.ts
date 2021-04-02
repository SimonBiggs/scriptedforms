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

import {
  beforeFromFile, after, waitForSpinner, makeUrlFromFile, customGet
} from './utilities/before-and-after'

describe('watchdog-test.md', () => {
  beforeEach(beforeFromFile('watchdog-manage.md'))
  afterEach(after())

  it('should update file on changes', () => {
    let createButton = element(by.css('.create-watchdog-test button'))
    browser.wait(ExpectedConditions.elementToBeClickable(createButton))
    createButton.click()

    waitForSpinner()
    customGet(makeUrlFromFile('watchdog-test.md'))
    waitForSpinner()

    let writeInMe = element(by.css('.write-in-me textarea'))
    browser.wait(ExpectedConditions.presenceOf(writeInMe))
    waitForSpinner()
    const testTextHeading = "Prepended Heading!"
    writeInMe.sendKeys(`# ${testTextHeading}`)
    waitForSpinner()

    let prependButton = element(by.css('.prepend-string-contents button'))
    prependButton.click()

    let newHeader = element(by.tagName('h1'))
    browser.wait(ExpectedConditions.presenceOf(newHeader))
    expect(newHeader.getText()).toEqual(testTextHeading)

    waitForSpinner()
    customGet(makeUrlFromFile('watchdog-manage.md'))
    waitForSpinner()

    let deleteButton = element(by.css('.delete-watchdog-test button'))
    browser.wait(ExpectedConditions.presenceOf(deleteButton))
    browser.wait(ExpectedConditions.elementToBeClickable(deleteButton))
    waitForSpinner()
    deleteButton.click()
  })
});