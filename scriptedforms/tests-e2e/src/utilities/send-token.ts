import {
  browser, element, by, ExpectedConditions
} from 'protractor';

describe('send-token', () => {
  it('should send token to notebook server', () => {
    browser.waitForAngularEnabled(false)
    browser.get(`http://localhost:8989/tree?token=${browser.params.token}`);
    let notebooks = element(by.id('notebooks'))
    browser.wait(ExpectedConditions.presenceOf(notebooks))
    expect(notebooks.isPresent()).toBe(true)
  })
});