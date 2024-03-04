const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userId: "userRandomID",
    dateCreated: new Date(),
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userId: "user2RandomID",
    dateCreated: new Date(),
  },
};


const { generateRandomString } = require('../util/util');

const urlModel = {
  urlDatabase,
  /**
   * Retrieves all short url objects for a given user id
   * @param {string} userId
   * @returns an array of short url objects
   */
  urlsForUser : function(userId) {
    const userUrls = {};
    for (let url in this.urlDatabase) {
      if (this.urlDatabase[url].userId === userId) {
        userUrls[url] = this.urlDatabase[url];
      }
    }
    return userUrls;
  },
  /**
   * Checks if a short code exists in the urlDatabase
   * @param {string} shortCode
   * @returns {boolean}
   */
  doesExist : function(shortCode) {
    return this.urlDatabase[shortCode] !== undefined;
  },
  /**
   * Adds a new short url to the urlDatabase
   * @param {string} longURL
   * @param {string} userId
   * @param {Date} dateCreated
   * @returns {string} the short code for the new entry
   */
  addShortUrl : function(longURL, userId, dateCreated = new Date()) {
    let shortCode = generateRandomString();
    while (this.doesExist(shortCode)) { // make sure we don't overwrite an existing short code
      shortCode = generateRandomString();
    }
    this.urlDatabase[shortCode] = {longURL, userId, dateCreated};
    return shortCode;
  },
  /**
   * Gets a short url object from the urlDatabase
   * @param {string} shortCode
   */
  getShortUrl : function(shortCode) {
    return this.urlDatabase[shortCode];
  },
  /**
   * Deletes a short url from the urlDatabase
   * @param {string} shortCode
   */
  deleteShortUrl : function(shortCode) {
    if (!this.doesExist(shortCode)) throw new Error("Short URL not found");
    delete this.urlDatabase[shortCode];
  },
  /**
   * Updates a short url in the urlDatabase
   * @param {string} shortCode
   * @param {string} longURL
   */
  updateShortUrl : function(shortCode, longURL) {
    if (!this.doesExist(shortCode)) throw new Error("Short URL not found");
    this.urlDatabase[shortCode].longURL = longURL;
  }
};


module.exports = urlModel;