const mongoose = require("mongoose");
const Dog = require("../models/dog");
const jwt = require("jsonwebtoken");

//Error handler function:
const handleErrors = (err) => {
  let errors = { name: "", description: "" };

  if (err.message.includes("dog validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

//Helper function to get the currently logged in user's Id:
const getCurrentUserId = (token) => {
  const decoded = jwt.verify(token, process.env.SESSION_SECRET);
  return decoded.id;
};

//Register a new dog:
exports.registerdog_post = async (req, res) => {
  const { name, description } = req.body;
  const status = "adoptable";
  const owner = getCurrentUserId(req.cookies.jwt);

  try {
    const newDog = await Dog.create({ name, description, owner, status });
    return res.status(201).send({ success: "success" });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(401).json(errors);
  }
};

//Get adoptable dogs to populate Adoptable Dogs page:
exports.adoptable_get = async (req, res) => {
  let isLoggedIn = res.locals.isLoggedIn;
  const userId = getCurrentUserId(req.cookies.jwt);
  let { page } = req.params;
  const dogsPerPage = 10;
  page = parseInt(page);

  const adoptableDogs = await Dog.find({ status: "adoptable" })
    .skip((page - 1) * dogsPerPage)
    .limit(dogsPerPage)
    .then((adoptableDogs) =>
      res.render("adoptableDogs", {
        adoptableDogs,
        isLoggedIn,
        userId,
        page,
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(401).json("Error connecting to database.");
    });
};

//Get adopted dogs to fill Adopted Dogs page:
exports.adopted_get = async (req, res) => {
  let isLoggedIn = res.locals.isLoggedIn;
  let { page } = req.params;
  const dogsPerPage = 10;
  page = parseInt(page);
  try {
    const adoptedDogs = await Dog.find({ status: "adopted" })
      .skip((page - 1) * dogsPerPage)
      .limit(dogsPerPage);
    res.render("adoptedDogs", { adoptedDogs, isLoggedIn, page });
  } catch (err) {
    res.status(401).message("Error connecting to database");
  }
};

//Delete a dog you registered:
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
    res.status(201).json("Dog has been deleted.");
  } else {
    res.status(401).json("Error deleting dog from database.");
  }
};

//Adopt a dog you haven't registered:
exports.adopt_patch = async (req, res) => {
  const { ownerMessage, dogId } = req.body;
  const newOwnerId = getCurrentUserId(req.cookies.jwt);

  const dog = await Dog.findById(dogId).then((dog) => dog.toJSON());

  if (dog.status === "adoptable" && dog.owner !== newOwnerId) {
    const doc = await Dog.findOneAndUpdate(
      { _id: dogId },
      { status: "adopted", newOwnerId: newOwnerId, ownerMessage: ownerMessage },
      { new: true }
    );
  } else {
    console.error("This dog is not adoptable");
  }
  res.status(201).json("Dog successfully adopted.");
};

//Brings you to the leave message page and the final adopt button:
exports.adopt_get = (req, res) => {
  const { dogId } = req.params;
  return res.render("adopt", { isLoggedIn: true, dogId: dogId });
};

exports.yourdogs_get = async (req, res) => {
  let { page } = req.params;
  let isLoggedIn = res.locals.isLoggedIn;
  const userId = getCurrentUserId(req.cookies.jwt);
  const dogsPerPage = 10;
  page = parseInt(page);

  const yourDogs = await Dog.find({
    $or: [{ owner: userId }, { newOwnerId: userId }],
  })
    .skip((page - 1) * dogsPerPage)
    .limit(dogsPerPage)
    .then((yourDogs) =>
      res.render("yourDogs", {
        yourDogs,
        isLoggedIn,
        page,
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(401).json("Error connecting to database.");
    });
};

exports.yourdogs_adoptable_get = async (req, res) => {
  let { page } = req.params;
  let isLoggedIn = res.locals.isLoggedIn;
  const userId = getCurrentUserId(req.cookies.jwt);
  const dogsPerPage = 10;
  page = parseInt(page);

  const yourDogs = await Dog.find({
    $and: [
      { status: "adoptable" },
      { $or: [{ owner: userId }, { newOwnerId: userId }] },
    ],
  })
    .skip((page - 1) * dogsPerPage)
    .limit(dogsPerPage)
    .then((yourDogs) =>
      res.render("yourDogs", {
        yourDogs,
        isLoggedIn,
        page,
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(401).json("Error connecting to database.");
    });
};

exports.yourdogs_adopted_get = async (req, res) => {
  let { page } = req.params;
  let isLoggedIn = res.locals.isLoggedIn;
  const userId = getCurrentUserId(req.cookies.jwt);
  const dogsPerPage = 10;
  page = parseInt(page);

  const yourDogs = await Dog.find({
    $and: [
      { status: "adopted" },
      { $or: [{ owner: userId }, { newOwnerId: userId }] },
    ],
  })
    .skip((page - 1) * dogsPerPage)
    .limit(dogsPerPage)
    .then((yourDogs) =>
      res.render("yourDogs", {
        yourDogs,
        isLoggedIn,
        page,
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(401).json("Error connecting to database.");
    });
};
