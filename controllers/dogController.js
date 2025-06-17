const mongoose = require("mongoose");
const Dog = require("../models/dog");
const jwt = require("jsonwebtoken");

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
  const token = req.cookies.jwt;
  let owner = "";

  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decodedToken) => {
      owner = decodedToken.id;
    });
  } else {
    res.redirect("/login");
  }

  try {
    const newDog = await Dog.create({ name, description, owner, status });
    return res.redirect("/adoptableDogs");
  } catch (err) {
    const errors = handleErrors(err);
    console.log(errors);
    return res.json({ errors });
  }
};

exports.adoptable_get = async (req, res) => {
  const token = req.cookies.jwt;
  let userID = "";
  let isLoggedIn = res.locals.isLoggedIn;

  try {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        userId = decodedToken.id;
      }
    });
    const adoptableDogs = await Dog.find({ status: "adoptable" });
    res.render("adoptableDogs", {
      adoptableDogs,
      isLoggedIn,
      userId,
    });
  } catch (err) {
    console.log(err);
    res.end();
  }
};

exports.adopted_get = async (req, res) => {
  let isLoggedIn = res.locals.isLoggedIn;
  try {
    const adoptedDogs = await Dog.find({ status: "adopted" });
    res.render("adoptedDogs", { adoptedDogs, isLoggedIn });
  } catch (err) {
    res.status(401).message("Error loading dogs");
  }
};

exports.dog_delete = async (req, res) => {
  const token = req.cookies.jwt;
  let currentUserId = "";
  const { dogId } = req.body;

  const dog = await Dog.findById(dogId)
    .then((dog) => dog.toJSON())
    .catch((err) => console.log(err));

  let ownerId = JSON.stringify(dog.owner);
  ownerId = ownerId.substring(1, ownerId.length - 1);

  try {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decodedToken) => {
      if (err) {
        console.log(err);
      } else {
        currentUserId = decodedToken.id.toString();
      }
    });

    if (ownerId.toString() === currentUserId.toString()) {
      const deletedDog = await Dog.findOneAndDelete({ _id: dogId });
      res.end();
    } else {
      console.error("You cannot delete a dog you did not register.");
    }
  } catch (err) {
    console.log(err);
  }
};

exports.adopt_patch = async (req, res) => {
  const { ownerMessage, dogId } = req.body;

  const doc = await Dog.findOneAndUpdate(
    { _id: dogId },
    { status: "adopted", ownerMessage: ownerMessage },
    { new: true }
  );
  res.end();
};

exports.adopt_get = (req, res) => {
  const { dogId } = req.params;
  return res.render("adopt", { isLoggedIn: true, dogId: dogId });
};
