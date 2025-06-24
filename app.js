//Import the dotenv file
const env = require("dotenv").config({
  path: process.cwd() + `/.env.${process.env.NODE_ENV}`,
});

//Express app:
const cookieParser = require("cookie-parser");
const express = require("express");
const app = express();
const session = require("express-session");
const ejs = require("ejs");
const mongooseConnectDB = require("./db");

app.set("view engine", "ejs");
app.set("views", "views");

//Import mongoose:
const mongoose = require("mongoose");

//Import & apply cors:
const cors = require("cors");
app.use(cors());

//Import routes:
const login = require("./routes/login");
const logout = require("./routes/logout");
const signup = require("./routes/signup");
const registerDog = require("./routes/registerDog");
const adoptableDogs = require("./routes/adoptableDogs");
const adoptedDogs = require("./routes/adoptedDogs");
const home = require("./routes/home");
const adopt = require("./routes/adopt");
const deleteDog = require("./routes/deleteDog");
const yourDogs = require("./routes/yourDogs");

//Middleware:
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
);

//ROUTES:
app.use("/", home);
app.use("/login", login);
app.use("/logout", logout);
app.use("/signup", signup);
app.use("/registerDog", registerDog);
app.use("/adoptableDogs", adoptableDogs);
app.use("/adoptedDogs", adoptedDogs);
app.use("/adopt", adopt);
app.use("/delete", deleteDog);
app.use("/yourDogs", yourDogs);

app.use((req, res, next) => {
  res.status(404).render("404", { isLoggedIn: false });
});

//Connect to Mongoose & server:
mongooseConnectDB(process.env.dbURI);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
