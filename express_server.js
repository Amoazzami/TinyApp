const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
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


app.get("/", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});


app.get("/u/:shortURL", (req, res) => {
  res.redirect(urlDatabase[req.params.shortURL])
});



app.post("/urls/:id/update", (req, res) => {
  //  urlDatabase[req.params.shortURL];
  urlDatabase[req.params.id] = req.body.longURL;
  res.redirect("/urls");
  // console.log("this is my long url", req.body.longURL);
  // console.log("this is my short url", req.params.id);
  console.log(urlDatabase)
});

app.post("/urls/:id/edit", (req, res) => {
res.redirect(`/urls/${req.params.id}`);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
  //res.redirect("/urls/")
});

app.post("/urls", (req, res) => {
  const longURL = req.body.longURL;
  const shortURL = generateRandomString(6);  
  urlDatabase[shortURL] = longURL;
  console.log(urlDatabase);
  res.redirect("/urls/");     // Respond with 'Ok' (we will replace this)
  
});

app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);

});

app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL };
  res.render("urls_show_test", templateVars);
});

app.post("/urls/:id/delete", (req, res) => {
delete urlDatabase[req.params.id];
  console.log(req.params.id);
res.redirect("/urls/");
});

app.get("/hello", (req, res) => {
  const templateVars = { greeting: 'Hello World!' };
  res.render("hello_world", templateVars);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

