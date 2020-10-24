const FrontPage = require('../pageobjects/front.page');

describe('Frontpage', () => {
    it('Should have a title', () => {
        FrontPage.open();
        expect(browser).toHaveTitle('Totally not another game that inspired this');
    });
});


