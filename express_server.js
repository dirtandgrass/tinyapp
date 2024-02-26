const express = require("express");
const app = express();
const PORT = 8080; // default port 8080


app.set("view engine", "ejs");


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
 * @description: This endpoint renders an html view urlDatabase
 */
app.get("/urls", (req, res) => {
  res.render("urls_index", { urls: urlDatabase });
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