const { BaseHandler } = require('./baseHandler');
const {
  ErrEmailInUse,
  ErrPasswordMisMatch,
  ErrEmailNotFound,
  ErrInvalidPassword,
} = require('../services/usersService');
const { validationResult } = require('express-validator');

class UsersHandler extends BaseHandler {
  constructor(args) {
    super();
    this.usersService = args.usersService;

    this.signUp = this.signUp.bind(this);
    this.signUpPost = this.signUpPost.bind(this);
    this.signIn = this.signIn.bind(this);
    this.signInPost = this.signInPost.bind(this);
    this.signOut = this.signOut.bind(this);
  }

  async signUp(req, res) {
    res.render('sign-up');
  }

  async signUpPost(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errors.array().forEach((error) => req.flash('error', error.msg));

      return res.render('sign-up', {
        flash: req.flash(),
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation,
      });
    }

    const { username, email, password, passwordConfirmation } = req.body;

    let user;

    try {
      user = await this.usersService.createUser(username, email, password, passwordConfirmation);
    } catch (err) {
      if (err instanceof ErrEmailInUse || err instanceof ErrPasswordMisMatch) {
        return res.render('sign-in', { err });
      } else {
        console.log(`failed to create a user: ${err}`);
        return res.render('sign-up', { oops: true });
      }
    }

    req.session.userId = user.id;

    req.flash('success', 'Account created!');

    res.redirect('/');
  }

  async signIn(req, res) {
    res.render('sign-in');
  }

  async signInPost(req, res) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      errors.array().forEach((error) => req.flash('error', error.msg));

      return res.render('sign-in', {
        flash: req.flash(),
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      });
    }

    const { username, email, password } = req.body;
    let user;

    try {
      user = await this.usersService.signInUser(username, email, password);
    } catch (err) {
      if (err instanceof ErrEmailNotFound || err instanceof ErrInvalidPassword) {
        return res.render('sign-up', { err });
      } else {
        console.log(`failed to sign in user: ${err}`);
        return res.render('sign-in', { oops: true });
      }
    }

    req.session.userId = user.id;
    req.flash('success', `You're signed in, ${user.username}!`);
    res.redirect('/movies');
  }

  async signOut(req, res) {
    delete req.session.userId;

    req.flash('success', `You're signed out. See you next time!`);
    res.redirect('/');
  }
}

module.exports = { UsersHandler };
