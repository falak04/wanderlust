const Listing = require('../models/listing');
const Review = require('../models/review');
const User = require('../models/user');

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', 'welcome to wanderlust');
      res.redirect('/listings');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('/signup');
  }
};
module.exports.renderSignup = (req, res) => {
  res.render('users/signup.ejs');
};
module.exports.renderlogin = (req, res) => {
  res.render('users/login.ejs');
};
module.exports.loginform = async (req, res) => {
  req.flash('success', 'welcome to Wanderlust!You are logged in');
  let redirectUrl = req.session.redirectUrl || '/listings';
  delete req.session.redirectUrl; // ✅ clear it so it doesn’t persist
  res.redirect(redirectUrl);
};
module.exports.logout = (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash('success', 'you are logged out');
    res.redirect('/listings');
  });
};
