const { assert } = require('chai');

const {generateRandomString, isValidUrl, getStringHash, compareStringHash} = require('../util/util');


describe('Utility Functions', function() {
  describe('generateRandomString', function() {
    it('should return a string of the specified length', function() {
      const length1 = 6;
      const randomString1 = generateRandomString(length1);

      assert.equal(randomString1.length, length1);
      const length2 = 4;
      const randomString2 = generateRandomString(length2);

      assert.equal(randomString2.length, length2);


    });
  });
  describe('isValidUrl', function() {
    it('should return true for a valid url', function() {
      const validUrl = 'https://www.google.com';

      assert.isTrue(isValidUrl(validUrl));
    });

    it('should return false for an invalid url', function() {
      const invalidUrl = 'hellokitty.not';

      assert.isFalse(isValidUrl(invalidUrl));
    });
  });

  describe('getStringHash', function() {
    it('should return a string', function() {
      const text = 'hello';
      const hash = getStringHash(text);

      assert.isString(hash);
    });
  });

  describe('compareStringHash', function() {
    it('should return true for a matching string and hash', function() {
      const text = 'hello';
      const hash = getStringHash(text);

      assert.isTrue(compareStringHash(text, hash));
    });

    it('should return false for a non-matching string and hash', function() {
      const text = 'hello';
      const hash = getStringHash(text);

      assert.isFalse(compareStringHash('goodbye', hash));
    });
  });
});
