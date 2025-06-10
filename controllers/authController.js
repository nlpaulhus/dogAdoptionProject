const User = require("../models/user");
const jwt = require("jsonwebtoken");
const maxAge = 3 * 24 * 60 * 60;

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SESSION_SECRET, { expiresIn: maxAge });
};

const handleErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.code === 11000) {
    errors.email = "That email is already registered.";

    return errors;
  }
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

const signup_post = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).render("loggedIn");
  } catch (err) {
    const errors = handleErrors(err);
    res.render("signup", { email: errors.email, password: errors.password });
    console.log(errors, err);
  }
};

module.exports = { signup_post };
