import {Config} from 'protractor';

export let config: Config = {
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