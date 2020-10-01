const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
const PORT = 8080; // default port 8080
app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const usersDataBase = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "123"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "1234"
  }
}

function generateRandomString(length) {
  let result = '';
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let lettersLength = letters.length;
  for ( let i = 0; i < length; i++ ) {
     result += letters.charAt(Math.floor(Math.random() * lettersLength));
  }
  return result;
}

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(6);  
  urlDatabase[shortURL] = longURL;
  res.redirect("/urls/");     // Respond with 'Ok' (we will replace this)
});

app.get('/urls', (req, res) => {
  let cookieID = req.cookies["user_id"];
  let userObject = usersDataBase[cookieID];
  const templateVars = { 
  urls: urlDatabase,
  user: userObject};
  res.render('urls_index', templateVars);
});

app.get("/", (req, res) => {
  const templateVars = { greeting: 'Hello World!',
 };
  res.render("hello_world", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL])
});

app.post("/urls/:id/update", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
});

app.post("/urls/:id/edit", (req, res) => {
res.redirect(`/urls/${req.params.id}`);
});

app.get("/urls/new", (req, res) => {
  let cookieID = req.cookies["user_id"];
  let userObject = usersDataBase[cookieID];
  const templateVars = {
    user: userObject,
    user_id: req.cookies["user_id"],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  let user_id =req.cookies["user_id"];
  const templateVars = { shortURL, longURL, user_id };
  res.render("urls_show_test", templateVars,);
});


app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls.json", (req, res) => {
  user_id: req.cookies["user_id"]
  res.json(urlDatabase);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls/");
});

app.get("/login", (req, res) => {
  let cookieID = req.cookies["user_id"];
  let userObject = usersDataBase[cookieID];
  res.render("login", {user_id: null, user: userObject});
});

app.post("/login", (req, res) => {
  let foundUser = false;
  let foundPassword = false;
  for (let id in usersDataBase) {
    if (usersDataBase[id].email === req.body.email && usersDataBase[id].password === req.body.password) {
      foundUser = true
      res.cookie("user_id", usersDataBase[id].id)
      break
    }
  } 
  if (foundUser) {
    return res.redirect("/urls")
  }
  res.status(400).send("Registation Failed: Please Enter a Valid Email & or Password");
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect('urls')
});

app.get("/register", (req, res) => {
  const templateVars = {
  user: null
  };
  res.render("register", templateVars);
});

app.get("/404", (req, res) => {
  res.render("404")
});

app.post("/register", (req, res) => {
  const {id, email, password} = req.body;
  if (email === '' || password === '') {
    res.status(400).send("Registation Failed: Please Enter a Valid Email & or Password");
  } 
  let foundUser; 
  for (let id in usersDataBase){
    if (usersDataBase[id].email === email) {
    foundUser = usersDataBase[id]; 
    res.status(400).send("Email Already in Use!");
    break
    }
  }
  if (foundUser) {
    return res.status(400).send("Registation Failed: Email has been taken")
  }
  let userID = generateRandomString(5);
  usersDataBase[userID] = { 
    id: userID,
    email: req.body.email,
    password: req.body.password
  }
  res.cookie('user_id', userID);
  return res.redirect("/urls")
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

