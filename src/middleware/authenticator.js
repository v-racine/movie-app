const requireAuth = (req, res, next) => {
  if (!req.session.userId) {
    req.flash('info', 'You must be signed in!');
    return res.redirect('/signIn');
  }

  next();
};

module.exports = { requireAuth };
