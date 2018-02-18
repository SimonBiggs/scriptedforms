// Because this file references protractor, you'll need to have it as a project
// dependency to use 'protractor/globals'. Here is the full list of imports:
//
// import {browser, element, by, By, $, $$, ExpectedConditions}
//   from 'protractor/globals';
//
// The jasmine typings are brought in via DefinitelyTyped ambient typings.
import {browser, element, by, 
  // By, $, $$, ExpectedConditions
} from 'protractor';

describe('protractor with typescript typings', () => {
  beforeEach(() => {
    browser.get('http://www.angularjs.org');
  });

  it('should greet the named user', () => {
    element(by.model('yourName')).sendKeys('Julie');
    let greeting = element(by.binding('yourName'));
    greeting.getText().then(value => {
      return expect(value).toEqual('Hello Julie!');
    })
  });

  it('should list todos', function() {
    let todoList = element.all(by.repeater('todo in todoList.todos'));
    todoList.count().then(value => {
      return expect(value).toEqual(2);
    })
    todoList.get(1).getText().then(value => {
      return expect(value).toEqual('build an angular app');
    })
    
  });
});