const { assert } = require('chai');

const { getUserByEmail } = require('../helpers.js');

const testUsers = {
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
};

describe('getUserByEmail', function() {
  it('return a user with valid email', function() {
    const user = getUserByEmail("user@example.com", testUsers)
    const expectedUserID = "userRandomID";
    assert(user === expectedUserID);
  });
});

describe('getUserByEmail', function() {
  it('return undefined when passed invalid email', function() {
    const user = getUserByEmail("fakeEmail@imaginary.com", testUsers)
    const expectedUserID = undefined;
    assert(user === expectedUserID);
  });
});