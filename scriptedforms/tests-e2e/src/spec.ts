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
    browser.get('http://localhost:8989');
    browser.wait(ExpectedConditions.presenceOf(
      element(by.tagName('app-form'))
    ))
  });

  it('should be have a heading', () => {
    let elem = element(by.tagName('h1'))
    browser.wait(ExpectedConditions.presenceOf(elem))
    let text = elem.getText()
    expect(text).toEqual('A landing page')
  })
});

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

describe('section-button.md', () => {
  beforeEach(() => {
    browser.waitForAngularEnabled(false)
    browser.get('http://localhost:8989/scriptedforms/section-button.md');
    browser.wait(ExpectedConditions.presenceOf(
      element(by.tagName('app-form'))
    ))
  });

  it('should run on click', () => {
    let runningButton = element(by.css('.check-my-running button'))
    browser.wait(ExpectedConditions.elementToBeClickable(runningButton))

    let initialOutput = element.all(by.css('.check-my-running .jp-OutputArea-output'))
    expect(initialOutput.count()).toEqual(0)

    runningButton.click()
    let outputArea = element(by.css('.check-my-running .jp-OutputArea-output'))
    browser.wait(ExpectedConditions.presenceOf(outputArea))

    let text = element(by.tagName('h1')).getText()
    expect(text).toEqual('Hello')
  })

  it('should be able to be named', () => {
    let namedButtonLabel = element(by.css('.check-my-name button span'))
    expect(namedButtonLabel.getText()).toEqual('foo')
  })

  it('should honour conditional', () => {
    let disableButton = element(by.css('.make-false button'))
    let enableButton = element(by.css('.make-true button'))

    browser.wait(ExpectedConditions.elementToBeClickable(disableButton))
    browser.wait(ExpectedConditions.elementToBeClickable(enableButton))

    let conditionalButton = element(by.css('.check-my-conditional button'))
    expect(conditionalButton.isEnabled()).toBe(false)

    let spinner = element(by.css('.floating-spinner'))

    enableButton.click()
    browser.wait(ExpectedConditions.stalenessOf(spinner))
    expect(conditionalButton.isEnabled()).toBe(true)

    disableButton.click()
    browser.wait(ExpectedConditions.stalenessOf(spinner))
    expect(conditionalButton.isEnabled()).toBe(false)
  })
});