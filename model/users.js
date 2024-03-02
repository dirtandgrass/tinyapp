const {generateRandomString, getStringHash, compareStringHash} = require('../util/util');

const users = {

};

const userModel = {
  users,
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
  findUserByEmail : function(email) {
    for (let user in this.users) {
      if (this.users[user].email === email) {
        console.log('user found', this.users[user]);
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
  }
};

module.exports = userModel;