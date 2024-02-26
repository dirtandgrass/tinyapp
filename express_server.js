const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const getRandom = require('./util/getRandom');

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
  console.log(req.body); // Log the POST request body to the console
  res.send("Ok"); // Respond with 'Ok' (we will replace this)
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