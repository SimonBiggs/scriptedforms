import {
  browser, element, by, ExpectedConditions
} from 'protractor';

describe('landing-page.md', () => {
  beforeEach(() => {
    browser.waitForAngularEnabled(false)
    browser.get('http://localhost:8989');
    browser.wait(ExpectedConditions.presenceOf(
      element(by.tagName('app-form'))
    ))
  });

  it('should have a heading', () => {
    let header = element(by.tagName('h1'))
    browser.wait(ExpectedConditions.presenceOf(header))
    let text = header.getText()
    expect(text).toEqual('A landing page')
  })
});