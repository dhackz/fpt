const Page = require('./page');

class FrontPage extends Page {
    open () {
        return super.open('');
    }
}

module.exports = new FrontPage();
