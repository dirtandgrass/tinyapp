// handles the user related endpoints

const express = require('express');
const router = express.Router();
const users = require('../model/users');

/**
 * @description: This endpoint renders an view of the registration form
 */
router.get("/register", (req, res) => {
  res.render("register", {user: req.userInfo});
});

/**
 * @description: This endpoint renders an view of the registration form
 */
router.post("/register", (req, res) => {
  const {email, password} = req.body;
  const emailTrim = email.trim().toLowerCase();

  if (!emailTrim || !password) {
    res.status(400).send('Invalid email or password');
    return;
  }
  const existingUser = users.findUserByEmail(emailTrim);

  if (existingUser) {
    res.status(400).send('That Email address is already registered');
    return;
  }

  const userId = users.addUser(emailTrim, password);
  res.cookie('user_id', userId).redirect('/urls');

});

/**
 * @description: This endpoint logs in a user if the email and password matches a user in the database
 */
router.post("/login", (req, res) => {
  const {email, password} = req.body;
  const emailTrim = email.trim().toLowerCase();
  if (email.trim() === '' || password.trim() === '') {
    res.status(400).send('Invalid email or password');
    return;
  }
  console.log(emailTrim, password);
  const user = users.login(emailTrim, password);

  if (user) {
    res.cookie('user_id', user.id);
    res.redirect('/urls');
    return;
  }

  res.status(403).send('Invalid email or password'); // TODO: stay on login page, but show error message

});

/**
 * @description: This endpoint renders an html view of the login template
  */
router.get("/login", (req, res) => {
  res.render("login", {user: req.userInfo});
});


/**
 * @description: This endpoint logs out the current user
 */
router.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});


module.exports = router;