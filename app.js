const express = require("express");
const app = express();
const ejs = require('ejs');


app.get("/", (req, res) => {
  res.sendFile("./views/index.html", { root: __dirname });
});

app.get("/signup", (req, res) => {
  res.sendFile("./views/signup.html", { root: __dirname });
});

app.get("/login", (req, res) => {
  res.sendFile("./views/login.html", { root: __dirname });
});

app.get("/registered", (req, res) => {
  res.sendFile("./views/registered.html", { root: __dirname });
});

app.get("/adopted", (req, res) => {
  res.sendFile("./views/adopted.html", { root: __dirname });
});

app.use((req, res) => {
  res.sendFile("./views/404.html", { root: __dirname });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
