// handles the /urls endpoints

const express = require('express');
const router = express.Router();
const {urlDatabase, urlsForUser} = require('../model/urls');
const {generateRandomString, isValidUrl} = require('../util/util');


/**
 * @description: This endpoint renders an html view urlDatabase
 */
router.get("/",(req, res) => {
  if (!req.userInfo) return res.redirect('/login');

  // filter the urlDatabase to only show urls created by the logged in user
  const userUrls = urlsForUser(req.userInfo.id);

  res.render("urls_index", { urls: userUrls, user: req.userInfo });
});

/**
 * @description: This endpoint endpoint creates a new entry in the urlDatabase
 */
router.post("/", (req, res) => {
  if (!req.userInfo) return res.status(401).render("error", {error: {
    code: 401,
    message:"You must be logged in to create a new short url"}
  });

  const userId = req.userInfo.id;
  const longURL = req.body.longURL;

  if (!isValidUrl(req.body.longURL)) {
    res.status(400).render('error', {error:{code:400, message:"Invalid URL"}});
    return;
  }

  let shortCode = generateRandomString();
  while (urlDatabase[shortCode]) { // make sure we don't overwrite an existing short code
    shortCode = generateRandomString();
  }
  urlDatabase[shortCode] = {longURL, userId};

  res.redirect(`/urls/${shortCode}`);
});

/**
 * @description: This endpoint renders an html view of an entry in the urlDatabase,
 * regex filter to prevent conflict with /new
 */
router.get("/:shortCode([a-zA-Z0-9]{4,8})", (req, res) => {
  if (!req.userInfo) return res.status(401).render("error", {error:{
    message: "You must be logged in to view this page",
    extended:'Please <a href="/register">register</a> or <a href="/login">login</a> to view and create tiny urls',
  }});

  const entry = urlDatabase[req.params.shortCode];
  if (!entry) {
    res.status(404).render('error', {error:{code:400, message:"Tiny URL not found"}});
    return;
  }

  if (entry.userId !== req.userInfo.id) {
    res.status(403).render('error', {error:{code:403, message:"You do not have permission to perform this action"}});
    return;
  }

  const templateVars = { id: req.params.shortCode, urlInfo: entry,user: req.userInfo};
  res.render("urls_show", templateVars);
});


/**
 * @description: This endpoint renders an html view of a form to create a new entry in the urlDatabase
 */
router.get("/new", (req, res) => {
  if (!req.userInfo) return res.redirect('/login');
  res.render("urls_new", {user: req.userInfo});
});



/**
 * @description: This endpoint deletes an entry from the urlDatabase
 */
router.delete("/:shortCode", (req, res) => {
  if (!req.userInfo) return res.render("error", {error:{
    message: "You must be logged in to view this page",
    extended:'Please <a href="/register">register</a> or <a href="/login">login</a> to view and create tiny urls',
  }});
  if (urlDatabase[req.params.shortCode].userId !== req.userInfo.id) {
    res.status(403).render('error', {error:{code:403, message:"You do not have permission to perform this action"}});
    return;
  }
  delete urlDatabase[req.params.shortCode];
  res.redirect('/urls');
});

/**
 * @description: This endpoint updates an entry in the urlDatabase
 */
router.put("/:shortCode", (req, res) => {
  if (!req.userInfo) return res.render("error", {error:{
    message: "You must be logged in to view this page",
    extended:'Please <a href="/register">register</a> or <a href="/login">login</a> to view and create tiny urls',
  }});
  if (urlDatabase[req.params.shortCode].userId !== req.userInfo.id) {
    res.status(403).render('error', {error:{code:403, message:"You do not have permission to perform this action"}});
    return;
  }
  if (!urlDatabase[req.params.shortCode] || !isValidUrl(req.body.longURL)) {
    res.status(400).render('error', {error:{code:400, message:"Tiny URL not found"}});
    return;
  }

  urlDatabase[req.params.shortCode].longURL = req.body.longURL;
  res.redirect('/urls');
});


module.exports = router;