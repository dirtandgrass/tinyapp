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
/**
 * Retrieves all short url objects for a given user id
 * @param {string} id
 * @returns an array of short url objects
 */
const urlsForUser = (id) => {
  const userUrls = {};
  for (let url in urlDatabase) {
    if (urlDatabase[url].userId === id) {
      userUrls[url] = urlDatabase[url];
    }
  }
  return userUrls;
};



module.exports = {urlDatabase, urlsForUser};