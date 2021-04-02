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

import { beforeFromFile, after } from './utilities/before-and-after'

const TEMPLATE_FILE = 'section-start.md'

describe(TEMPLATE_FILE, () => {
  beforeEach(beforeFromFile(TEMPLATE_FILE));
  afterEach(after())

  it('should successfully run on start', () => {
    let elem = element(by.css('.check-me .jp-OutputArea-output'))
    browser.wait(ExpectedConditions.presenceOf(elem))

    let text = element(by.tagName('h1')).getText()
    expect(text).toEqual('Hello')
  })
});