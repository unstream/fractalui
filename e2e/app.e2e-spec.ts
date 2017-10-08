import { AppPage } from './app.po';

describe('fractal-ui App', () => {
  let page: AppPage;

  beforeEach(() => {
    page = new AppPage();
  });

  it('Test if the page starts with 3 iterations.', () => {
    page.navigateTo();


    expect(page.getIterationInput().getAttribute('value')).toEqual('3');
  });
});
