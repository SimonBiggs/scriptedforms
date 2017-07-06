import { ElectroninsertsStagingPage } from './app.po';

describe('electroninserts-staging App', () => {
  let page: ElectroninsertsStagingPage;

  beforeEach(() => {
    page = new ElectroninsertsStagingPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
