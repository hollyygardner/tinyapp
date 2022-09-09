const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const cookieParser = require('cookie-parser');
const { getUserByEmail } = require("./helpers");


app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());

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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

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

function isNewEmail(emailAddress) {
  for (const u in users) {
    if (users[u].email.toUpperCase() === emailAddress.toUpperCase()) {
      return false;
    }
  }
  return true;
};

app.post("/urls", (req, res) => {
  console.log("req.body:",req.body);  // Log the POST request body to the console
  const shortURL = generateRandomString()
  const longURL = req.body.longURL;
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});

app.get("/register", (req, res) => {
  const user = users[req.cookies["user_id"]];
  templateVars = { user };
  res.render("registration", templateVars);
});

app.post("/register", (req, res) => {
  const newUserId = generateRandomString(8);
  const newUserEmail = req.body.email;
  const newUserPassword = req.body.password;

  if (newUserEmail && newUserPassword && isNewEmail(newUserEmail, users)) {
    users[newUserId] = {
      id: newUserId,
      email: newUserEmail,
      password: newUserPassword
    };
    res.cookie("user_id", newUserId);
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
  const user = users[req.cookies["user_id"]];
  const templateVars = { urls: urlDatabase, user };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const user = users[req.cookies["user_id"]];
  templateVars = { user };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user }; // MODIFIED!!!!!!
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL];
  console.log('Testing the database:', urlDatabase);
  console.log('Param: ', req.params);
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post('/login', (req, res) => {
  const enteredEmail = req.body.email;
  const enteredPassword = req.body.password;
  const userId = getUserByEmail(enteredEmail, users);
  if (userId && users[userId].password === enteredPassword) {
    res.cookie("user_id", userId);
    res.redirect("/urls");
  } else {
    res.status(403);
    res.send('Error 403');
  }
  const templateVars = { user };
  res.render("login", templateVars);
});


app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls");
});

app.get('/login', (req, res) => {
  const user = users[req.cookies["user_id"]];
  const templateVars = { user };
  res.render("login", templateVars);
});

