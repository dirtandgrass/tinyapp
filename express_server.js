const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const {generateRandomString} = require('./util/getRandom');

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

/**
 * @description: This endpoint renders the json of the urlDatabase
 */
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

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
 * @description: This endpoint renders an html view urlDatabase
 */
app.get("/urls", (req, res) => {
  res.render("urls_index", { urls: urlDatabase });
});

/**
 * @description: This endpoint endpoint creates a new entry in the urlDatabase
 */
app.post("/urls", (req, res) => {

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
  res.render("urls_new");
});

/**
 * @description: This endpoint renders an html view of an entry in the urlDatabase
 */
app.get("/urls/:shortCode", (req, res) => {
  const templateVars = { id: req.params.shortCode, longURL: urlDatabase[req.params.shortCode] };
  res.render("urls_show", templateVars);
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});