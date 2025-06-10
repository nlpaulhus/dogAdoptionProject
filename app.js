const express = require("express");
const session = require("express-session");
const app = express();
const ejs = require("ejs");
const login = require("./routes/login");
const signup = require("./routes/signup");
const registerDog = require("./routes/registerDog");
const adoptableDogs = require("./routes/adoptableDogs");
const adoptedDogs = require("./routes/adoptedDogs");
const mongoose = require("mongoose");
const env = require("dotenv").config();

const dbURI =
  "mongodb+srv://nlpaulhus:sPgbXnbnsMVQxhAq@cluster0.h7vzrrc.mongodb.net/dog_adoption_website?retryWrites=true&w=majority";

mongoose
  .connect(dbURI)
  .then((result) => console.log("Connected to database"))
  .then((result) => {
    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  })
  .catch((err) => console.log(err));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.content = req.session.content;
  delete req.session.content;
  next();
});

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/login", login);
app.use("/signup", signup);
app.use("/registerDog", registerDog);
app.use("/adoptableDogs", adoptableDogs);
app.use("/adoptedDogs", adoptedDogs);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/loggedIn", (req, res) => {
  res.render("loggedIn");
});

app.use((req, res) => {
  res.render("404");
});
