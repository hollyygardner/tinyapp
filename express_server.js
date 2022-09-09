const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const { getUserByEmail, urlsForUserId } = require("./helpers");
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');



app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ["bootcamp"],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

function generateRandomString(stringLength) {  
let result = ""
let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
charactersLength = characters.length
for (let i = 0; i < stringLength; i++) {
  result += characters.charAt(Math.floor(Math.random() * charactersLength))
}
return result
}

const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
    hashedPassword: "purple-monkey-dinosaur$&%Sc"
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
    hashedPassword: "dishwasher-funk&*$Hg"
  },
};

function isNewEmail(emailAddress) {
  for (const u in users) {
    if (users[u].email.toUpperCase() === emailAddress.toUpperCase()) {
      return false;
    }
  }
  return true;
};

app.post("/urls", (req, res) => {
  if (req.session["user_id"]) {
    const shortURL = generateRandomString(6);
    const longURL = req.body.longURL;
    urlDatabase[shortURL] = {
      longURL,
      userID: req.session["user_id"]
    };
    res.redirect(`/urls/${shortURL}`);
  } else {
    res.status(403);
    res.send('Error 403. Must be logged in to request URL.');
  }
});

app.get("/register", (req, res) => {
  const user = users[req.session.user_id];
  templateVars = { user };
  res.render("registration", templateVars);
});

app.post("/register", (req, res) => {
  const newUserId = generateRandomString(8);
  const newUserEmail = req.body.email;
  const newUserPassword = req.body.password;
  const hashedPassword = bcrypt.hashSync(newUserPassword, 10);

  if (newUserEmail && newUserPassword && isNewEmail(newUserEmail, users)) {
    users[newUserId] = {
      id: newUserId,
      email: newUserEmail,
      hashedPassword
    };
    req.session.user_id = users[newUserId].id;
    res.redirect("/urls");
  } else {
    res.status(400);
    res.send('Error 400');
  };
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const user = users[req.session.user_id];
  if (user) {
    const userURLdatabase = urlsForUserId(user.id, urlDatabase);
    const templateVars = { urls: userURLdatabase, user };
    res.render("urls_index", templateVars);
  } else {
    res.redirect("/login");
  }
});

app.get("/urls/new", (req, res) => {
  const user = users[req.session.user_id];
  templateVars = { user };
  if (user) {
    res.render("urls_new", templateVars);
  } else {
    res.render("login", templateVars);
  }
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user }; // MODIFIED!!!!!!
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL;;
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  const user = users[req.session.user_id];
  if (user && user.id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
  } else {
    res.status(403);
    res.send("Error - you do not own URL");
  }
  res.redirect("/urls");
});

app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = req.body.longURL;
  const user = users[req.session.user_id];
  if (user && user.id === urlDatabase[req.params.shortURL].userID) {
    urlDatabase[shortURL] = {
      longURL,
      userID: req.session.user_id
    };
    res.redirect("/urls");
  } else {
    res.status(403);
    res.send("Error - you do not own URL. Please login to continue");

  }
});

app.get("/urls/:shortURL", (req, res) => { 
  const user = users[req.session.user_id];
  if (user && urlDatabase[req.params.shortURL] && user.id === urlDatabase[req.params.shortURL].userID) {

    const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user };
    res.render("urls_show", templateVars);
  } else {
    res.status(403);
    res.send("Error - the URL does not exist or belong to you. Please login to continue");
  }
});

app.post('/login', (req, res) => {
  //Login endpoint 
  const enteredEmail = req.body.email;
  const enteredPassword = req.body.password;
  const userId = getUserByEmail(enteredEmail, users);
  if (userId && bcrypt.compareSync(enteredPassword, users[userId].hashedPassword)) {
    req.session.user_id = users[userId].id;
    res.redirect("/urls");
  } else {
    res.status(400);
    res.send('Error 400 - invalid login');
  }
});

app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

app.get('/login', (req, res) => {
  const user = users[req.session.user_id];
  const templateVars = { user };
  res.render("login", templateVars);
});

