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

const getCurrentUserId = (token) => {
  const decoded = jwt.verify(token, process.env.SESSION_SECRET);
  return decoded.id;
};

exports.register_dog = async (req, res) => {
  const { name, description } = req.body;
  const status = "adoptable";
  const owner = getCurrentUserId(req.cookies.jwt);

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
  let isLoggedIn = res.locals.isLoggedIn;
  const userId = getCurrentUserId(req.cookies.jwt);

  const adoptableDogs = await Dog.find({ status: "adoptable" })
    .then((adoptableDogs) =>
      res.render("adoptableDogs", {
        adoptableDogs,
        isLoggedIn,
        userId,
      })
    )
    .catch((err) => {
      console.log(err);
      res.end();
    });
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
  const { dogId } = req.body;
  const currentUserId = getCurrentUserId(req.cookies.jwt);

  const dog = await Dog.findById(dogId)
    .then((dog) => dog.toJSON())
    .catch((err) => console.log(err));

  let ownerId = JSON.stringify(dog.owner);
  ownerId = ownerId.substring(1, ownerId.length - 1);

  if (ownerId === currentUserId && dog.status === "adoptable") {
    const deletedDog = await Dog.findOneAndDelete({ _id: dogId });
    res.end();
  } else {
    console.error("You cannot delete a dog you did not register.");
  }
};

exports.adopt_patch = async (req, res) => {
  const { ownerMessage, dogId } = req.body;

  const dog = await Dog.findById(dogId).then((dog) => dog.toJSON());

  if (dog.status === "adoptable") {
    const doc = await Dog.findOneAndUpdate(
      { _id: dogId },
      { status: "adopted", ownerMessage: ownerMessage },
      { new: true }
    );
  } else {
    console.error("This dog is not adoptable");
  }
  res.end();
};

exports.adopt_get = (req, res) => {
  const { dogId } = req.params;
  return res.render("adopt", { isLoggedIn: true, dogId: dogId });
};
