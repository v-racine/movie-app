const { PasswordHelper } = require('../utilities/passwordHelper');

class ErrEmailInUse extends Error {
  constructor() {
    super('Email in use');
  }
}

class ErrPasswordMisMatch extends Error {
  constructor() {
    super('Passwords must match');
  }
}

class ErrEmailNotFound extends Error {
  constructor() {
    super('Email not found');
  }
}

class ErrInvalidPassword extends Error {
  constructor() {
    super('Incorrect password');
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

  async signInUser(username, email, password) {
    const user = await this.usersRepo.getOneBy({ username, email });
    if (!user) {
      throw new ErrEmailNotFound();
    }

    const validPassword = await PasswordHelper.ComparePasswords(user.password, password);
    if (!validPassword) {
      throw new ErrInvalidPassword();
    }

    return user;
  }
}

module.exports = {
  UsersService,
  ErrEmailInUse,
  ErrPasswordMisMatch,
  ErrEmailNotFound,
  ErrInvalidPassword,
};
