import {
  browser, element, by, ExpectedConditions
} from 'protractor';

describe('variable-string.md', () => {
  beforeEach(() => {
    browser.waitForAngularEnabled(false)
    browser.get('http://localhost:8989/scriptedforms/variable-string.md');
    browser.wait(ExpectedConditions.presenceOf(
      element(by.tagName('app-form'))
    ))
  });

  it('should sensibly handle backslash', () => {
    let firstString = element(by.css('.write-in-me-first textarea'))
    let secondString = element(by.css('.write-in-me-second textarea'))

    let resultContents = element(by.css('.see-my-result .jp-OutputArea-output pre'))
    browser.wait(ExpectedConditions.presenceOf(resultContents))
    expect(resultContents.getText()).toEqual('')

    let backslashString = '\\\\\\'
    firstString.sendKeys(backslashString)

    let spinner = element(by.css('.floating-spinner'))
    browser.wait(ExpectedConditions.stalenessOf(spinner))
    expect(secondString.getAttribute('ng-reflect-model')).toEqual(backslashString)
    expect(resultContents.getText()).toEqual(backslashString)

    secondString.sendKeys(backslashString)
    browser.wait(ExpectedConditions.stalenessOf(spinner))
    expect(firstString.getAttribute('ng-reflect-model')).toEqual(backslashString + backslashString)
    expect(resultContents.getText()).toEqual(backslashString + backslashString)
  })
});