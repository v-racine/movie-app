const { PasswordHelper } = require('../utilities/passwordHelper');

class ErrEmailInUse extends Error {
  constructor() {
    super('Email in use');
  }
}

class ErrPasswordMisMatch extends Error {
  constructor() {
    super('Password must match');
  }
}

class UsersService {
  constructor(args) {
    this.usersRepo = args.usersRepo;
  }

  async createUser(username, email, password, passwordConfirmation) {
    const existingUser = await this.usersRepo.getOneBy({ email });
    if (existingUser) {
      throw new ErrEmailInUse();
    }

    if (password !== passwordConfirmation) {
      throw new ErrPasswordMisMatch();
    }

    const { hex, salt } = await PasswordHelper.HexAndSalt(password);

    const user = await this.usersRepo.create({
      username,
      email,
      password: `${hex}.${salt}`,
    });

    return user;
  }
}

module.exports = { UsersService };
