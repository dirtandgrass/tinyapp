const {generateRandomString, getStringHash, compareStringHash} = require('../util/util');

const users = {};

const userModel = {
  users,
  /**
   * Authenticates a user based on email and password
   * @param {string} email
   * @param {string} password
   * @returns {object|boolean} user object if the email and password match, false otherwise
   */
  authUser : function(email, password) {
    const user = this.findUserByEmail(email);
    if (!user) {
      return false;
    }
    if (compareStringHash(password, user.hashedPassword)) {
      return user;
    }
    return false;
  },
  /**
   * Finds a user with the given email
   * @param {string} email
   * @returns {object|boolean} user object if the email is found, false otherwise
   */
  findUserByEmail : function(email) {
    if (typeof email !== 'string' || email.trim() === '') return false;
    for (let user in this.users) {
      if (this.users[user].email === email) {
        console.log('user found', this.users[user]);
        return this.users[user];
      }
    }
    return false; // user not found
  },
  /**
   * Finds a user with the given id
   * @param {string} id
   * @returns {object|boolean} user object if the id is found, false otherwise
   */
  findUserById : function(id) {
    return this.users[id];
  },
  /**
   * Adds a new user to the users object
   * @param {string} email
   * @param {string} password
   * @returns {string} the id of the new user
   */
  addUser : function(email, password) {
    const userId = generateRandomString();
    const hashedPassword = getStringHash(password);

    this.users[userId] = {
      id: userId,
      email,
      hashedPassword,
    };
    return userId;
  }
};

module.exports = userModel;