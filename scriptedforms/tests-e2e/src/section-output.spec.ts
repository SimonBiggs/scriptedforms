import {
  browser, element, by, ExpectedConditions
} from 'protractor';

describe('section-output.md', () => {
  beforeEach(() => {
    browser.waitForAngularEnabled(false)
    browser.get('http://localhost:8989/scriptedforms/section-output.md');
    browser.wait(ExpectedConditions.presenceOf(
      element(by.tagName('app-form'))
    ))
  });

  it('should run when variables are changed', () => {
    let outputContents = element(by.css('.check-me-running .jp-OutputArea-output pre'))
    browser.wait(ExpectedConditions.presenceOf(outputContents))
    expect(outputContents.getText()).toEqual('foo: , bar: 0')

    let fooString = element(by.css('.write-in-me textarea'))
    fooString.sendKeys('boo')

    let spinner = element(by.css('.floating-spinner'))
    browser.wait(ExpectedConditions.stalenessOf(spinner))
    expect(outputContents.getText()).toEqual('foo: boo, bar: 0')

    let adderButton = element(by.css('.click-me button'))
    adderButton.click()
    browser.wait(ExpectedConditions.stalenessOf(spinner))
    expect(outputContents.getText()).toEqual('foo: boo, bar: 1')
  })
});