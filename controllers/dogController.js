import Dog from "../models/dog.js";
import verify from "jsonwebtoken";

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
  const decoded = verify(token, process.env.SESSION_SECRET);
  return decoded.id;
};

//Register a new dog:
export async function registerdog_post(req, res) {
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
}

//Get adoptable dogs to populate Adoptable Dogs page:
export async function adoptable_get(req, res) {
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
}

//Get adopted dogs to fill Adopted Dogs page:
export async function adopted_get(req, res) {
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
}

//Delete a dog you registered:
export async function dog_delete(req, res) {
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
}

//Adopt a dog you haven't registered:
export async function adopt_patch(req, res) {
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
}

//Brings you to the leave message page and the final adopt button:
export function adopt_get(req, res) {
  const { dogId } = req.params;
  return res.render("adopt", { isLoggedIn: true, dogId: dogId });
}

export async function yourdogs_get(req, res) {
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
}

export async function yourdogs_adoptable_get(req, res) {
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
}

export async function yourdogs_adopted_get(req, res) {
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
}
