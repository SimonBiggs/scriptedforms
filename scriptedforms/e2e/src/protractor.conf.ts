import { Config } from 'protractor';

let config: Config = {
  framework: 'jasmine',
  params: {
    token: process.env.JUPYTER_TOKEN
  },
  specs: [ 'utilities/send-token.js', process.env.PROTRACTOR_PATTERN ],
  noGlobals: false
};

if (process.env.SAUCE_USERNAME) {
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
  config.capabilities = {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER,
    'platform': "Windows 10"
  };
} else {
  config.capabilities = {
    browserName: 'chrome'
  }
  config.seleniumAddress = 'http://localhost:4444/wd/hub'
}

export { config };
