import { ScriptedformsWebsitePage } from './app.po';

describe('scriptedforms-website App', () => {
  let page: ScriptedformsWebsitePage;

  beforeEach(() => {
    page = new ScriptedformsWebsitePage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
