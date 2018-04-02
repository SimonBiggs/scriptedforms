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


