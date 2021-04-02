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

export function waitForSpinner() {
  let spinner = element(by.css('.floating-spinner'))
  browser.wait(ExpectedConditions.stalenessOf(spinner))
}

export function customGet(url: string) {
  browser.get(`${url}?telemetry=0`)
}

export function before(url: string) {
  return () => {
    browser.waitForAngularEnabled(false)
    customGet(url);
    browser.wait(ExpectedConditions.presenceOf(
      element(by.tagName('app-form'))
    ))
    waitForSpinner()
  }
}

export function makeUrlFromFile(templateFile: string) {
  return `http://localhost:8989/scriptedforms/use/${templateFile}`
}

export function beforeFromFile(templateFile: string) {
  return before(makeUrlFromFile(templateFile))
}

export function after() {
  return () => {
    waitForSpinner()
  }
}