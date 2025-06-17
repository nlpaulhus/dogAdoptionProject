const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const maxAge = 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SESSION_SECRET, { expiresIn: maxAge });
};

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

exports.signup_post = async (req, res) => {
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
};

exports.login_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    //If user email not in database:
    if (!user) {
      return res.status(401).json({ error: "User doesn't exist" });
    }

    const auth = await bcrypt.compare(password, user.password);
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
};

exports.logout_get = (req, res) => {
  res.locals.isLoggedIn = false;
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
