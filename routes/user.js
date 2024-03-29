// handles the user related endpoints

const express = require('express');
const router = express.Router();
const users = require('../model/users');

/**
 * @description: This endpoint renders an view of the registration form
 */
router.get("/register", (req, res) => {
  if (req.userInfo) return res.redirect('/urls'); // if the user is already logged in, redirect to /urls
  res.render("register", {user: req.userInfo});
});

/**
 * @description: This endpoint renders an view of the registration form
 */
router.post("/register", (req, res) => {
  const {email, password} = req.body;
  const emailTrim = email.trim().toLowerCase();

  if (!emailTrim || !password) {
    res.status(400).render('error', {error:{code:400, message:"Invalid email or password"}});
    return;
  }
  const existingUser = users.findUserByEmail(emailTrim);

  if (existingUser) {
    res.status(400).render('error', {error:{code:400, message:"That Email address is already registered"}});
    return;
  }

  const userId = users.addUser(emailTrim, password);
  req.session.userId = userId;
  res.redirect('/urls');

});

/**
 * @description: This endpoint logs in a user if the email and password matches a user in the database
 */
router.post("/login", (req, res) => {
  const {email, password} = req.body;
  const emailTrim = email.trim().toLowerCase();
  if (email.trim() === '' || password.trim() === '') {
    res.status(400).render('error', {error:{code:400, message:"Invalid email or password"}});
    return;
  }

  const user = users.authUser(emailTrim, password);

  if (user) {
    req.session.userId = user.id;
    res.redirect('/urls');
    return;
  }

  res.status(401).render('error', {error:{code:401, message:"Incorrect email or password"}});

});

/**
 * @description: This endpoint renders an html view of the login template
  */
router.get("/login", (req, res) => {
  if (req.userInfo) return res.redirect('/urls'); // if the user is already logged in, redirect to /urls
  res.render("login", {user: req.userInfo});
});


/**
 * @description: This endpoint logs out the current user
 */
router.post("/logout", (req, res) => {
  req.session = null;
  res.redirect('/login');
});


module.exports = router;