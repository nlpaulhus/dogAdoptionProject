//Import the dotenv file

import dotenv from "dotenv";
dotenv.config({
  path: process.cwd() + `/.env.${process.env.NODE_ENV}`,
});

//Express app:
import cookieParser from "cookie-parser";
import express, { json, urlencoded } from "express";
const app = express();
import session from "express-session";
import ejs from "ejs";
import mongooseConnectDB from "./db.js";

app.set("view engine", "ejs");
app.set("views", "views");

//Import mongoose:
import mongoose from "mongoose";

//Import & apply cors:
import cors from "cors";
app.use(cors());

//Import routes:
import login from "./routes/login.js";
import logout from "./routes/logout.js";
import signup from "./routes/signup.js";
import registerDog from "./routes/registerDog.js";
import adoptableDogs from "./routes/adoptableDogs.js";
import adoptedDogs from "./routes/adoptedDogs.js";
import home from "./routes/home.js";
import adopt from "./routes/adopt.js";
import deleteDog from "./routes/deleteDog.js";
import yourDogs from "./routes/yourDogs.js";

//Middleware:
app.use(json());
app.use(urlencoded({ extended: true }));
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
