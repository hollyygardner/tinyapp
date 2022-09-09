const getUserByEmail = function(emailAddress, users) {
  for (let u in users) {
    if (users[u].email.toUpperCase() === emailAddress.toUpperCase()) {
      return u;
    }
  }
};

const urlsForUserId = function(id, URLdatabase) {
  let userURLS = {};
  for (let url in URLdatabase) {
    if (URLdatabase[url].userID === id) {
      userURLS[url] = URLdatabase[url];
    }
  }
  return userURLS;
}


module.exports = { getUserByEmail, urlsForUserId };