//Import the dotenv file
const env = require("dotenv").config();

//Express app:
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();

const session = require("express-session");
const ejs = require("ejs");

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

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

//Import mongoose:
const mongoose = require("mongoose");

//Import & apply cors:
const cors = require("cors");
app.use(cors());

//Import routes:
const login = require("./routes/login");
const signup = require("./routes/signup");
const registerDog = require("./routes/registerDog");
const adoptableDogs = require("./routes/adoptableDogs");
const adoptedDogs = require("./routes/adoptedDogs");

//Middleware:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//ROUTES:
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

//Connect to Mongoose:
mongoose
  .connect(process.env.dbURI)
  .then((result) => console.log("Connected to database"))
  .then((result) => {
    app.listen(3000, () => {
      console.log("Listening on port 3000");
    });
  })
  .catch((err) => console.log(err));
