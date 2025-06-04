const express = require("express");
const app = express();
const ejs = require("ejs");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/signup", (req, res) => {
  res.render("signup");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/registered", (req, res) => {
  res.render("registered");
});

app.get("/adopted", (req, res) => {
  res.render("adopted");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.use((req, res) => {
  res.render("404");
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
