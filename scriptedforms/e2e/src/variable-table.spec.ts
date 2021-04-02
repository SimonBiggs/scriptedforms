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
  browser,
  element, by,
  ExpectedConditions,
  // ElementFinder, Key
} from 'protractor';

import { beforeFromFile, after, waitForSpinner } from './utilities/before-and-after'

const TEMPLATE_FILE = 'variable-table.md'

var hasClass = function (element: any, cls: any) {
  return element.getAttribute('class').then(function (classes: any) {
    return classes.split(' ').indexOf(cls) !== -1;
  });
};

describe(TEMPLATE_FILE, () => {
  beforeEach(beforeFromFile(TEMPLATE_FILE));
  afterEach(after())

  it('first table test', () => {
    let defaultTableInput = element(by.css('.default mat-checkbox'))
    let typeEditTableInput = element(by.css('.type-edit mat-checkbox'))
    browser.wait(ExpectedConditions.presenceOf(defaultTableInput))
    browser.wait(ExpectedConditions.presenceOf(typeEditTableInput))

    expect(hasClass(typeEditTableInput, 'mat-checkbox-checked')).toBe(false);

    defaultTableInput.click()

    waitForSpinner()
    expect(hasClass(typeEditTableInput, 'mat-checkbox-checked')).toBe(true);
  })
});


