const getUserByEmail = function(emailAddress, users) {
  for (let i in users) {
    if (users[i].email.toUpperCase() === emailAddress.toUpperCase()) {
      return i;
    }
  }
};