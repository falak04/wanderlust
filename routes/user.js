const express = require('express');
const router = express.Router();
const User = require('../models/user.js');
const WrapAsync = require('../utils/WrapAsync.js');
const passport = require('passport');
const { saveRedirectUrl } = require('../middleware.js');

const userController = require('../controllers/users.js');

router.post('/signup', WrapAsync(userController.signup));
router.get('/signup', userController.renderSignup);
router.post('/signup', WrapAsync(userController.signup));

router.get('/login', userController.renderlogin);
router.post(
  '/login',
  saveRedirectUrl,
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true,
  }),
  userController.loginform
);

router.get('/logout', userController.logout);
module.exports = router;
