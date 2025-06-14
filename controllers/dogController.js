const mongoose = require("mongoose");
const Dog = require("../models/dog");

const handleErrors = (err) => {
  let errors = { name: "", description: "" };

  if (err.message.includes("dog validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

exports.register_dog = async (req, res) => {
  const { name, description } = req.body;
  const status = "adoptable";

  try {
    const newDog = await Dog.create({ name, description, status });
    return res.redirect('/adoptableDogs');
  } catch (err) {
    const errors = handleErrors(err);
    console.log(errors);
    return res.json({ errors });
  }
};

exports.adoptable_get = async (req, res) => {
  let isLoggedIn = true;
  try {
    const adoptableDogs = await Dog.find({ status: "adoptable" });
    res.render("adoptableDogs", { adoptableDogs, isLoggedIn });
  } catch (err) {
    res.status(401).message("Error loading dogs");
  }
};
