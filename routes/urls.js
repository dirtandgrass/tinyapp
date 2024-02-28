const express = require('express');
const router = express.Router();
const {urlDatabase} = require('../model/urls');
const {generateRandomString, isValidUrl} = require('../util/util');

// handles the /urls endpoints

/**
 * @description: This endpoint renders an html view urlDatabase
 */
router.get("/",(req, res) => {
  res.render("urls_index", { urls: urlDatabase, user: req.userInfo });
});

/**
 * @description: This endpoint endpoint creates a new entry in the urlDatabase
 */
router.post("/", (req, res) => {

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
router.get("/new", (req, res) => {
  res.render("urls_new", {user: req.userInfo});
});

/**
 * @description: This endpoint renders an html view of an entry in the urlDatabase
 */
router.get("/:shortCode", (req, res) => {
  const templateVars = { id: req.params.shortCode, longURL: urlDatabase[req.params.shortCode],user: req.userInfo};
  res.render("urls_show", templateVars);
});

/**
 * @description: This endpoint deletes an entry from the urlDatabase
 */
router.post("/:shortCode/delete", (req, res) => {
  delete urlDatabase[req.params.shortCode];
  res.redirect('/urls');
});

/**
 * @description: This endpoint updates an entry in the urlDatabase

 */
router.post("/:shortCode", (req, res) => {
  if (!urlDatabase[req.params.shortCode] || !isValidUrl(req.body.longURL)) {
    res.status(400).send('Invalid URL');
  } else {
    urlDatabase[req.params.shortCode] = req.body.longURL;
    res.redirect('/urls');
  }

});


module.exports = router;