// Because this file references protractor, you'll need to have it as a project
// dependency to use 'protractor/globals'. Here is the full list of imports:
//
// import {browser, element, by, By, $, $$, ExpectedConditions}
//   from 'protractor/globals';
//
// The jasmine typings are brought in via DefinitelyTyped ambient typings.
import {browser, element, by, ExpectedConditions
  // By, $, $$, 
} from 'protractor';

describe('landing-page.md', () => {
  beforeEach(() => {
    browser.waitForAngularEnabled(false)
    browser.get('http://localhost:8989/scriptedforms/landing-page.md');
  });

  it('should be have a heading', () => {
    element(by.tagName('h1')).getText().then(value => {
      return expect(value).toEqual('A landing page')
    })
  })
});

describe('section-start.md', () => {
  beforeEach(() => {
    browser.waitForAngularEnabled(false)
    browser.get('http://localhost:8989/scriptedforms/section-start.md');
  });

  it('should successfully run section-start', () => {
    let section = element(by.css('.check-me .jp-OutputArea-output'))
    browser.wait(ExpectedConditions.presenceOf(section))

    element(by.tagName('h1')).getText().then(value => {
      return expect(value).toEqual('Hello')
    })
  })
});