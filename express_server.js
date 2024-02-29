const PORT = 8080; // default port 8080

const express = require("express");
const app = express();

const path = require("path");

const cookieParser = require('cookie-parser');
const users = require('./model/users');
const {urlDatabase} = require('./model/urls');

const urlsRoute = require('./routes/urls');
const usersRoute = require('./routes/user');

app.set("view engine", "ejs");

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());



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
 * @description: This endpoint redirects the browser to the url based on a shortcode
 */
app.get("/u/:id", (req, res, next) => {
  const longURL = urlDatabase[req.params.id];
  if (!longURL) {
    res.status(404).render("error",{error:{code:404,message:'URL not found'}});
    next();
  } else {
    res.redirect(longURL);
  }
});

// Mount the routes
app.use("/", usersRoute);
app.use("/urls", urlsRoute);

/**
 * @description: Redirects root request to the /urls page (TBR)
 */
app.get("/", (req, res) => {
  res.redirect('/urls');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});