const { BaseHandler } = require('./baseHandler');
const { validationResult } = require('express-validator');

class UsersHandler extends BaseHandler {
  constructor(args) {
    super();
    this.usersService = args.usersService;

    this.createUser = this.createUser.bind(this);
  }

  async createUser() {}
}

module.exports = { UsersHandler };
