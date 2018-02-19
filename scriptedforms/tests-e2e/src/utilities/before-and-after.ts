import {
  browser, element, by, ExpectedConditions
} from 'protractor';

export function waitForSpinner() {
  let spinner = element(by.css('.floating-spinner'))
  browser.wait(ExpectedConditions.stalenessOf(spinner))
}

export function before(url: string) {
  return () => {
    browser.waitForAngularEnabled(false)
    browser.get(url);
    browser.wait(ExpectedConditions.presenceOf(
      element(by.tagName('app-form'))
    ))
    waitForSpinner()
  }
}

export function beforeFromFile(templateFile: string) {
  return before('http://localhost:8989/scriptedforms/' + templateFile)
}

export function after() {
  return () => {
    waitForSpinner()
  }
}