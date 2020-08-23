////////////////////////////////////////////////////////////////////////////////
//  Main
////////////////////////////////////////////////////////////////////////////////

const express = require('express');
const session = require('express-session');
const url = require('url');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const bParse = require('body-parser');
const auth = require('./assets/authentication.js');
const app = express();
app.use(express.static('./assets/public')); // css and js files
app.use(bParse.urlencoded({ extended: true }));
app.use(bParse.json());
app.use(session({
  secret: auth.session_secret,
  resave: true,
  saveUninitialized: false
}));
app.use(auth.passport.initialize());
app.use(auth.passport.session());
app.set('view-engine', 'ejs');

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

app.get("/", (req, res) => {
  res.render('index.ejs');
});

app.get("/signup", (req, res) => {
  res.redirect('/register');
});

app.get("/login", auth.loggedOffVerification, (req, res) => {
  let err = (req.query.err == 1) ? true : false;
  res.render('login.ejs', { err: err });
});

app.post("/login", auth.loggedOffVerification, auth.passport.authenticate('local',{
  successRedirect:'/profile',
  failureRedirect: '/login?err=1'
}));

app.get("/register", auth.loggedOffVerification, (req, res) => {
  res.render('register.ejs', { err: req.query.err });
});

app.post("/register", auth.loggedOffVerification, (req, res) => {
  let email = req.body.email;
  let uname = req.body.uname;
  let passw = req.body.passw;
  auth.register(email, uname, passw).then(errcode => {
    if(!errcode)
      res.redirect("/profile");
    else{
      res.redirect(`/register?err=${errcode}`);
    }
  });
});

app.get("/register", auth.loggedOffVerification, (req, res) => {
  res.render('register.ejs');
});

app.get("/profile", auth.loggedOnVerification, (req, res) => {
  res.render('profile.ejs', { uname: req.user.uname });
});

app.get("/logout", auth.loggedOnVerification, (req, res) => {
  req.logout();
  res.redirect("/login");
});

////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

var server = app.listen(5000);

////////////////////////////////////////////////////////////////////////////////
