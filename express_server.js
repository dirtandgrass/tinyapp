const express = require("express");
const app = express();
const path = require("path");
const PORT = 8080; // default port 8080
const {generateRandomString, isValidUrl} = require('./util/util');
const cookieParser = require('cookie-parser');
const users = require('./model/users');

app.set("view engine", "ejs");

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

/**
 * @description: This middleware checks if the user is logged and adds the user object to the request
 */
app.use((req, res, next) => {
  const userId = req.cookies.user_id;
  if (userId) {
    const user = users.findUserById(userId);
    if (user) {
      req.userInfo = user; // attach the user object to the request
    }
  }
  next();
});


/**
 * @description: This endpoint renders the json of the urlDatabase
 */
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

/**
 * @description: This endpoint redirects the browser to the longURL
 */
app.get("/u/:id", (req, res, next) => {
  const longURL = urlDatabase[req.params.id];
  if (!longURL) {
    res.status(404).send('URL not found');
    next();
  } else {
    res.redirect(longURL);
  }
});

/**
 * @description: This endpoint renders an view of the registration form
 */
app.get("/register", (req, res) => {
  res.render("register", {user: req.userInfo});
});

/**
 * @description: This endpoint renders an view of the registration form
 */
app.post("/register", (req, res) => {
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
 * @description: This endpoint renders an html view urlDatabase
 */
app.get("/urls", (req, res) => {
  res.render("urls_index", { urls: urlDatabase, user: req.userInfo });
});

/**
 * @description: This endpoint endpoint creates a new entry in the urlDatabase
 */
app.post("/urls", (req, res) => {

  if (!isValidUrl(req.body.longURL)) {
    res.status(400).send('Invalid URL');
    return;
  }

  let shortCode = generateRandomString();
  while (urlDatabase[shortCode]) {
    shortCode = generateRandomString();
  }
  urlDatabase[shortCode] = req.body.longURL;

  res.redirect(`/urls/${shortCode}`);
});

/**
 * @description: This endpoint renders an html view of a form to create a new entry in the urlDatabase
 */
app.get("/urls/new", (req, res) => {
  res.render("urls_new", {user: req.userInfo});
});

/**
 * @description: This endpoint renders an html view of an entry in the urlDatabase
 */
app.get("/urls/:shortCode", (req, res) => {
  const templateVars = { id: req.params.shortCode, longURL: urlDatabase[req.params.shortCode],user: req.userInfo};
  res.render("urls_show", templateVars);
});

/**
 * @description: This endpoint deletes an entry from the urlDatabase
 */
app.post("/urls/:shortCode/delete", (req, res) => {
  delete urlDatabase[req.params.shortCode];
  res.redirect('/urls');
});

/**
 * @description: This endpoint updates an entry in the urlDatabase

 */
app.post("/urls/:shortCode", (req, res) => {
  if (!urlDatabase[req.params.shortCode] || !isValidUrl(req.body.longURL)) {
    res.status(400).send('Invalid URL');
  } else {
    urlDatabase[req.params.shortCode] = req.body.longURL;
    res.redirect('/urls');
  }

});



/**
 * @description: This endpoint logs in a user if the email and password matches a user in the database
 */
app.post("/login", (req, res) => {
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
app.get("/login", (req, res) => {
  res.render("login", {user: req.userInfo});
});


/**
 * @description: This endpoint logs out the current user
 */
app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});