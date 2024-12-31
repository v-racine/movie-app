class HomeHandler {
  constructor() {
    this.getHomePage = this.getHomePage.bind(this);
  }

  async getHomePage(req, res) {
    res.render('home');
  }
}

module.exports = { HomeHandler };
