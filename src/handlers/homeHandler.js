const { BaseHandler } = require('./baseHandler');

class HomeHandler extends BaseHandler {
  constructor() {
    super();
    this.getHomePage = this.getHomePage.bind(this);
  }

  async getHomePage(req, res) {
    res.render('home');
  }
}

module.exports = { HomeHandler };
