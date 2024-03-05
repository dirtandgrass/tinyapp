const PORT = 8080; // default port 8080
const COOKIE_SECRET = process.env.COOKIE_SECRET || "THE SEKRAT COOKIE RECIPE";
const express = require("express");
const methodOverride = require('method-override');
const app = express();

const path = require("path");

const cookieSession = require('cookie-session');
const users = require('./model/users');
const {urlDatabase} = require('./model/urls');

const {generateRandomString} = require('./util/util');

const urlsRoute = require('./routes/urls');
const usersRoute = require('./routes/user');

app.set("view engine", "ejs");


app.use(methodOverride('_method'));
app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cookieSession({
  name: 'session',
  secret: COOKIE_SECRET
}));




/**
 * @description: This middleware checks if the user is logged and adds the user object to the request
 */
app.use((req, res, next) => {
  const userId = req.session.userId;

  if (userId) {
    const user = users.findUserById(userId);
    if (user) {
      req.userInfo = user; // attach the user object to the request
    }
  }
  next();
});

/**
 * @description: This middleware sets a cookie to track unique visitors
 */
app.use((req, res, next) => {
  if (!req.session.visitorId) {
    req.session.visitorId = generateRandomString(4);
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
  const entry = urlDatabase[req.params.id];

  if (!entry || !entry.longURL) {
    res.status(404).render("error",{error:{code:404,message:'URL not found'}});
    next();
  } else {

    entry.visitCount = (entry.visitCount || 0) + 1;

    // store visitor ids in a set
    entry.visitors = entry.visitors || new Set();
    entry.visitors.add(req.session.visitorId);

    // store visit details
    if (!entry.visits) entry.visits = [];
    entry.visits.push({visitorId: req.session.visitorId, timestamp: new Date(), remoteIP: req.ip});

    res.redirect(entry.longURL);
  }
});

// Mount the routes
app.use("/", usersRoute);
app.use("/urls", urlsRoute);

/**
 * @description: Redirects root request to the /urls page (TBR)
 */
app.get("/", (req, res) => {
  if (req.userInfo) return res.redirect('/urls');
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});