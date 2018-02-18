import {
  browser, element, by, ExpectedConditions
} from 'protractor';

describe('section-start.md', () => {
  beforeEach(() => {
    browser.waitForAngularEnabled(false)
    browser.get('http://localhost:8989/scriptedforms/section-start.md');
    browser.wait(ExpectedConditions.presenceOf(
      element(by.tagName('app-form'))
    ))
  });

  it('should successfully run section-start', () => {
    let elem = element(by.css('.check-me .jp-OutputArea-output'))
    browser.wait(ExpectedConditions.presenceOf(elem))

    let text = element(by.tagName('h1')).getText()
    expect(text).toEqual('Hello')
  })
});