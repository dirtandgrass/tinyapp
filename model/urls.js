const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userId: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userId: "user2RandomID",
  },
};
/**
 * Retrieves all short urls for a given user id
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