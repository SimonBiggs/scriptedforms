import { Config, browser } from 'protractor';

let config: Config = {
  framework: 'jasmine',
  params: {
    token: process.env.JUPYTER_TOKEN
  },
  specs: [ 'utilities/send-token.js', process.env.PROTRACTOR_PATTERN ],
  noGlobals: false
};

if (process.env.SAUCE_USERNAME) {
  config.capabilities = {
    'browserName': 'chrome',
    'name': `ScriptedForms`,
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'platform': "Windows 10"
  };
  config.seleniumAddress = `http://${process.env.SAUCE_USERNAME}:${process.env.SAUCE_ACCESS_KEY}@localhost:4445/wd/hub`

  process.env.SELENIUM_SESSION_ID = browser.getSession()
} else {
  config.capabilities = {
    browserName: 'chrome'
  }
  config.seleniumAddress = 'http://localhost:4444/wd/hub'
}

export { config };
