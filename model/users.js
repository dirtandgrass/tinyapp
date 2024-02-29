const {generateRandomString, getStringHash} = require('../util/util');

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "user@example.com",
    password: "purple-monkey-dinosaur", // testing, tbr
    hashedPassword: "bdc2daee4dc8850c8f196db9ddba8c0bf201f62e",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk", // testing, tbr
    hashedPassword: "e823c076bbf15024e4c27dc41f2db4a414b0dd62",
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