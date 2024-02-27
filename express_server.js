const express = require("express");
const app = express();
const path = require("path");
const PORT = 8080; // default port 8080
const {generateRandomString, isValidUrl} = require('./util/urlUtil');


app.set("view engine", "ejs");
app.use("/public", express.static(path.join(__dirname, "public")));
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
 * @description: This endpoint renders an html view urlDatabase
 */
app.get("/urls", (req, res) => {
  res.render("urls_index", { urls: urlDatabase });
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
  res.render("urls_new");
});

/**
 * @description: This endpoint renders an html view of an entry in the urlDatabase
 */
app.get("/urls/:shortCode", (req, res) => {
  const templateVars = { id: req.params.shortCode, longURL: urlDatabase[req.params.shortCode] };
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

app.post("/login", (req, res) => {
  // get the referrer so can redirect to page from which the login was initiated
  const ref = req.get('Referrer');
  res.cookie('username', req.body.username);
  if (ref) {
    res.redirect(ref);
  } else {
    res.redirect('/urls');
  }
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});