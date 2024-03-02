const bcrypt = require('bcryptjs');
/**
 * Generates a random string of ascii alpha-numeric characters
 * @param {number} number of characters to generate
 * @returns
 */
const generateRandomString = (length = 6) => {
  if (typeof length !== 'number' || length < 1) throw new Error('length must be a number');

  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

/**
 * Validates a url
 * @param {*} url the url to validate
 * @returns {boolean} true if the url is valid, false otherwise
 */
const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

const getStringHash = (text) => {
  return bcrypt.hashSync(text, 10);
};

const compareStringHash = (text, hash) => {
  return bcrypt.compareSync(text, hash);
};


module.exports = {generateRandomString, isValidUrl, getStringHash, compareStringHash};