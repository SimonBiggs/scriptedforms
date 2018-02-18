import {
  browser, element, by, ExpectedConditions, ElementFinder, Key
} from 'protractor';


function writeInBothAndTest(text: string, sendKeysInto?: (elementFinder: ElementFinder) => void) {
  let firstString = element(by.css('.write-in-me-first textarea'))
  let secondString = element(by.css('.write-in-me-second textarea'))

  let resultContents = element(by.css('.see-my-result .jp-OutputArea-output pre'))
  browser.wait(ExpectedConditions.presenceOf(resultContents))
  expect(resultContents.getText()).toEqual('')

  if (!sendKeysInto) {
    sendKeysInto = (elementFinder: ElementFinder) => {
      elementFinder.sendKeys(text)
    }
  }

  sendKeysInto(firstString)
  let spinner = element(by.css('.floating-spinner'))
  browser.wait(ExpectedConditions.stalenessOf(spinner))
  expect(secondString.getAttribute('ng-reflect-model')).toEqual(text)
  expect(resultContents.getText()).toEqual(text)

  sendKeysInto(secondString)
  browser.wait(ExpectedConditions.stalenessOf(spinner))
  expect(firstString.getAttribute('ng-reflect-model')).toEqual(text + text)
  expect(resultContents.getText()).toEqual(text + text)
}


describe('variable-string.md', () => {
  beforeEach(() => {
    browser.waitForAngularEnabled(false)
    browser.get('http://localhost:8989/scriptedforms/variable-string.md');
    browser.wait(ExpectedConditions.presenceOf(
      element(by.tagName('app-form'))
    ))
  });

  it('should handle backslash', () => {
    writeInBothAndTest('\\\\\\')
  })

  it('should handle double quotes', () => {
    writeInBothAndTest('""""""')
  })

  it('should handle single quotes', () => {
    writeInBothAndTest("''''''")
  })

  it('should handle new lines', () => {
    let sendKeysInto = (elementFinder: ElementFinder) => {
      elementFinder.sendKeys(
        'foo', Key.ENTER, 'bar', Key.ENTER, 'boo', Key.ENTER, 'hoo')
    }
    writeInBothAndTest('foo\nbar\nboo\nhoo', sendKeysInto)
  })

  it('should handle quotes and backslashes together', () => {
    writeInBothAndTest("\\'\\\"\\\\")
  })

  it('should handle fences', () => {
    writeInBothAndTest("``` ~~~ ``` ~~~")
  })
});