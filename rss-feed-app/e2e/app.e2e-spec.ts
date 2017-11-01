import { RssFeedAppPage } from './app.po';

describe('rss-feed-app App', () => {
  let page: RssFeedAppPage;

  beforeEach(() => {
    page = new RssFeedAppPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
