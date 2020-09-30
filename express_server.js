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
  const templateVars = { 
  urls: urlDatabase, 
  username: req.cookies['username']};
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
  const templateVars = {
    username: req.cookies["username"],
  };
  res.render("urls_new", templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  let username =req.cookies["username"];
  const templateVars = { shortURL, longURL, username };
  res.render("urls_show_test", templateVars,);
});


app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls.json", (req, res) => {
  username: req.cookies["username"]
  res.json(urlDatabase);
});

app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls/");
});

app.get("/login", (req, res) => {
  res.render("login", {username: null});
});

app.post("/login", (req, res) => {
  console.log(req.body.username);
  const email = req.body.email;
  const password = req.body.password;
  res.cookie('username', req.body.username);
  res.redirect("/urls");
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect('urls')
});

app.get("/register", (req, res) => {
  const templateVars = {
  username: req.cookies["username"] || null,
  };
  console.log("reference", templateVars.username)
  res.render("register", templateVars);
});

// app.post("/register", (req, res) => {
//   const {email, password} = req.body;
//   // if (!email || !password) {
//   //   return res.send('email and passowrd cannot be blank');
//   // }
// });

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});