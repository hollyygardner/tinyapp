const getUserByEmail = function(emailAddress, users) {
  for (let u in users) {
    if (users[u].email.toUpperCase() === emailAddress.toUpperCase()) {
      return u;
    }
  }
};

module.exports = { getUserByEmail };