const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// const cookieParser = require('cookie-parser');

// app.use(cookieParser('secretcode'));
// app.get('/signedcookie', (req, res) => {
//   res.cookie('made-in', 'India', { signed: true });
//   res.send('signed sent');
// });
// app.get('/verify', (req, res) => {
//   console.log(req.signedCookies);
//   res.send('verified');
// });
// app.get('/getcookies', (req, res) => {
//   res.cookie('greet', 'hello');
//   res.send('send cookie');
// });
// app.get('/', (req, res) => {
//   console.dir(req.cookies);
//   res.send('Hi,I am root');
// });
const sessionOptions = {
  secret: 'mysupersecstring',
  resave: false,
  saveUninitialized: true,
};
app.use(session(sessionOptions));
app.use(flash());
app.use((req, res, next) => {
  res.locals.successm = req.flash('success');
  res.locals.errorm = req.flash('error');
  next();
});
app.get('/register', (req, res) => {
  let { name = 'anonymus' } = req.query;
  req.session.name = name;
  if (name === 'anonymus') {
    req.flash('error', 'error occured');
  } else {
    req.flash('success', 'user registerd');
  }
  res.redirect('/hello');
});
app.get('/hello', (req, res) => {
  res.render('page.ejs', { name: req.session.name });
});
// app.get('/reqcount', (req, res) => {
//   if (req.session.count) {
//     req.session.count++;
//   } else {
//     req.session.count = 1;
//   }
//   res.send('qhh');
// });
// app.get('/test', (req, res) => {
//   res.send('test success');
// });
app.listen(3000, () => {
  console.log('running');
});
