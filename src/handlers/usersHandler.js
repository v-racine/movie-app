const { BaseHandler } = require('./baseHandler');
const { validationResult } = require('express-validator');

class UsersHandler extends BaseHandler {
  constructor(args) {
    super();
    this.usersService = args.usersService;

    this.signUp = this.signUp.bind(this);
    this.signUpPost = this.signUpPost.bind(this);
  }

  async signUp(req, res) {
    res.render('sign-up');
  }

  async signUpPost(req, res) {}
}

module.exports = { UsersHandler };
