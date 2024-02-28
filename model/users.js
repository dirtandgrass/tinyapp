const {generateRandomString, getStringHash} = require('../util/util');

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

const userModel = {
  users,
  findUserByEmail : function(email) {
    for (let user in this.users) {
      if (this.users[user].email === email) {
        return this.users[user];
      }
    }
    return false;
  },
  findUserById : function(id) {
    return this.users[id];
  },
  addUser : function(email, password) {
    const userId = generateRandomString();
    const hashedPassword = getStringHash(password);
    this.users[userId] = {
      id: userId,
      email,
      hashedPassword,
    };

    return userId;
  },
  login: function(email, password) {
    const user = this.findUserByEmail(email);
    if (user && user.hashedPassword === getStringHash(password)) {

      return user;
    }
    return false;
  }
};

module.exports = userModel;