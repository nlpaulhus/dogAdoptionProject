import User from "../models/user.js";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
const maxAge = 24 * 60 * 60;

//Helper function to create jwt token:
const createToken = (id) => {
  return jwt.sign({ id }, process.env.SESSION_SECRET, { expiresIn: maxAge });
};

//Helper function to create errors object:
const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.code === 11000) {
    errors.email = "That email is already registered.";

    return errors;
  }
  if (err.message.includes("User validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

//Signup post:
export async function signup_post(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.locals.isLoggedIn = true;
    res.status(201).json({ success: "Success" });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(401).json(errors);
  }
}

//Login post:
export async function login_post(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    //If user email not in database:
    if (!user) {
      return res.status(401).json({ error: "User doesn't exist" });
    }

    //checking password
    const auth = await compare(password, user.password);
    if (auth === false) {
      return res.status(401).json({ error: "Incorrect password" });
    } else {
      const token = createToken(user._id);
      res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
      res.locals.isLoggedIn = true;
      res.status(201).json({ success: "Success" });
    }
  } catch (err) {
    console.log(err);
    res.status(401).json({ error: "Unknown login error" });
  }
}

//Logout get:
export function logout_get(req, res) {
  res.locals.isLoggedIn = false;
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
}
