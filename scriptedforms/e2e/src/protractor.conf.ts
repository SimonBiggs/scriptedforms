import { Config } from 'protractor';

let config: Config = {
  framework: 'jasmine',
  capabilities: {
    browserName: 'chrome'
  },
  params: {
    token: process.env.JUPYTER_TOKEN
  },
  specs: [ 'utilities/send-token.js', process.env.PROTRACTOR_PATTERN ],
  seleniumAddress: 'http://localhost:4444/wd/hub',

  noGlobals: false
};


if (process.env.TRAVIS) {
  config.sauceUser = process.env.SAUCE_USERNAME;
  config.sauceKey = process.env.SAUCE_ACCESS_KEY;
  config.capabilities = {
    'browserName': 'chrome',
    'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER,
    'build': process.env.TRAVIS_BUILD_NUMBER
  };
}

export { config };
