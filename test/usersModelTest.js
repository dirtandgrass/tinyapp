const { assert } = require('chai');

const userModel = require('../model/users');


describe('userModel', function() {
  describe('findUserByEmail', function() {
    it('should return a user with valid email', function() {
      const user = userModel.findUserByEmail('user@example.com');

      const expectedUserId = "userRandomID";

      assert.equal(user.id, expectedUserId);
    });
    it('should return false with invalid email', function() {
      const user = userModel.findUserByEmail('nonsense@hellokitty.not');


      assert.isFalse(user);
    });
  });
  describe('findUserById', function() {
    it('should return a user with valid id', function() {
      const user = userModel.findUserById('user2RandomID');

      const expectedUserId = "user2RandomID";

      assert.equal(user.id, expectedUserId);
    });
    it('should return false with invalid id', function() {
      const user = userModel.findUserById('nonsense');


      assert.isFalse(user);
    });
  });
  describe('addUser', function() {
    it('should add a user to the users object', function() {
      const email = '1@1.com';
      const password = 'password';
      const userId = userModel.addUser(email, password);

      const user = userModel.findUserById(userId);

      assert.equal(user.email, email);
      assert.equal(user.hashedPassword, userModel.users[userId].hashedPassword);
    });

    it('should not add a user with an existing email', function() {


      const email = '1@1.com';
      const password = 'password';
      userModel.addUser(email, password);

      console.log(userModel.users);
      const userCountAfterAdd1 = Object.keys(userModel.users).length;

      const userId = userModel.addUser(email, password);
      console.log(userModel.users);
      const userCountAfterAdd2 = Object.keys(userModel.users).length;

      assert.equal(userCountAfterAdd1, userCountAfterAdd2);
      assert.isFalse(userId);
    });
  });
});