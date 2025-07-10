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

//Import api test routes:
import apiLogin from "./apiRoutes/apiLogin.js";
import apiSignup from "./apiRoutes/apiSignup.js";
import apiRegisterDog from "./apiRoutes/apiRegisterDog.js";
import apiAdoptableDogs from "./apiRoutes/apiAdoptableDogs.js";
import apiAdoptedDogs from "./apiRoutes/apiAdoptedDogs.js";
import apiAdopt from "./apiRoutes/apiAdopt.js";
import apiDeleteDog from "./apiRoutes/apiDeleteDog.js";
import apiYourDogs from "./apiRoutes/apiYourDogs.js";
import apiYourAdoptedDogs from "./apiRoutes/apiYourAdoptedDogs.js";

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

//API TEST ROUTES:
app.use("/api/login", apiLogin);
app.use("/api/signup", apiSignup);
app.use("/api/registerDog", apiRegisterDog);
app.use("/api/adoptableDogs", apiAdoptableDogs);
app.use("/api/adoptedDogs", apiAdoptedDogs);
app.use("/api/adopt", apiAdopt);
app.use("/api/delete", apiDeleteDog);
app.use("/api/yourDogs", apiYourDogs);
app.use("/api/youradopteddogs", apiYourAdoptedDogs);

app.get("/api/welcome", (req, res) => {
  res.status(200).send({ message: "Welcome" });
});

app.use((req, res, next) => {
  res.status(404).render("404", { isLoggedIn: false });
});

//Connect to Mongoose & server:
mongooseConnectDB(process.env.dbURI);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

export default app;
