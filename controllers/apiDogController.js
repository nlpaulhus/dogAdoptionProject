import Dog from "../models/dog.js";
import jwt from "jsonwebtoken";

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
export async function api_registerdog_post(req, res) {
  const { name, description, owner } = req.body;
  const status = "adoptable";

  try {
    const newDog = await Dog.create({ name, description, owner, status });
    return res.status(201).json({ newDog });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(401).json(errors);
  }
}

//Get adoptable dogs to populate Adoptable Dogs page:
export async function api_adoptable_get(req, res) {
  let isLoggedIn = res.locals.isLoggedIn;
  const userId = getCurrentUserId(req.cookies.jwt);
  let { page } = req.params;
  const dogsPerPage = 10;
  page = parseInt(page);
  let previous = (page - 1).toString();
  let next = (page + 1).toString();
  let skipValue = 0;

  if (page > 1) {
    skipValue = (page - 1) * dogsPerPage;
  }

  const adoptableDogGet = await Dog.find({ status: "adoptable" })
    .skip(skipValue)
    .limit(dogsPerPage)
    .then((adoptableDogs) =>
      res.status(201).render("adoptableDogs", {
        adoptableDogs,
        isLoggedIn,
        userId,
        previous,
        next,
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(401).json("Error connecting to database.");
    });
}

//Get adopted dogs to fill Adopted Dogs page:
export async function api_adopted_get(req, res) {
  let isLoggedIn = res.locals.isLoggedIn;
  let { page } = req.params;
  const dogsPerPage = 10;
  page = parseInt(page);
  let previous = (page - 1).toString();
  let next = (page + 1).toString();
  let skipValue = 0;

  if (page > 1) {
    skipValue = (page - 1) * dogsPerPage;
  }

  try {
    const adoptedDogs = await Dog.find({ status: "adopted" })
      .skip(skipValue)
      .limit(dogsPerPage);
    res.render("adoptedDogs", { adoptedDogs, isLoggedIn, previous, next });
  } catch (err) {
    res.status(401).message("Error connecting to database");
  }
}

//Delete a dog you registered:
export async function api_dog_delete(req, res) {
  const { dogId, currentUserId } = req.body;

  const dog = await Dog.findById(dogId)
    .then((dog) => dog.toJSON())
    .catch((err) => console.log(err));

  if (dog.owner === currentUserId && dog.status === "adoptable") {
    try {
      await Dog.findByIdAndDelete(dogId);
      res.status(201).json("Dog has been deleted.");
    } catch (err) {
      res.status(501).json("Error Error Error");
    }
  } else {
    res.status(401).json("Error deleting dog from database.");
  }
}

//Adopt a dog you haven't registered:
export async function api_adopt_patch(req, res) {
  const { ownerMessage, dogId, newOwnerId } = req.body;

  const dog = await Dog.findById(dogId).then((dog) => dog.toJSON());
  let updatedDog = {};
  if (dog.status === "adoptable" && dog.owner !== newOwnerId) {
    updatedDog = await Dog.findOneAndUpdate(
      { _id: dogId },
      { status: "adopted", newOwnerId: newOwnerId, ownerMessage: ownerMessage },
      { new: true }
    );
  } else {
    console.error("This dog is not adoptable");
  }
  res.status(201).json({ updatedDog });
}

//Brings you to the leave message page and the final adopt button:
export function api_adopt_get(req, res) {
  const { dogId } = req.params;
  return res.render("adopt", { isLoggedIn: true, dogId: dogId });
}

export async function api_yourdogs_get(req, res) {
  let { currentUserId } = req.body;
  let { page } = req.params;

  const dogsPerPage = 10;
  page = parseInt(page);
  let previous = (page - 1).toString();
  let next = (page + 1).toString();
  let skipValue = 0;

  if (page > 1) {
    skipValue = (page - 1) * dogsPerPage;
  }

  const yourDogs = await Dog.find({ owner: currentUserId })
    .skip(skipValue)
    .limit(dogsPerPage)
    .then((yourDogs) => res.status(201).json({ yourDogs }))
    .catch((err) => {
      console.log(err);
      res.status(401).json("Error connecting to database.");
    });
}

export async function api_yourdogs_adoptable_get(req, res) {
  let { page } = req.params;
  let { currentUserId } = req.body;
  const dogsPerPage = 10;
  page = parseInt(page);
  let previous = (page - 1).toString();
  let next = (page + 1).toString();
  let skipValue = 0;

  if (page > 1) {
    skipValue = (page - 1) * dogsPerPage;
  }

  const yourDogs = await Dog.find({
    $and: [{ status: "adoptable" }, { owner: currentUserId }],
  })
    .skip(skipValue)
    .limit(dogsPerPage)
    .then((yourDogs) => res.status(201).json({ yourDogs }))
    .catch((err) => {
      console.log(err);
      res.status(401).json("Error connecting to database.");
    });
}

export async function api_yourdogs_adopted_get(req, res) {
  let { page } = req.params;
  let { currentUserId } = req.body;

  const dogsPerPage = 10;
  page = parseInt(page);
  let previous = (page - 1).toString();
  let next = (page + 1).toString();

  let skipValue = 0;

  if (page > 1) {
    skipValue = (page - 1) * dogsPerPage;
  }

  const yourDogs = await Dog.find({
    $and: [{ status: "adopted" }, { owner: currentUserId }],
  })
    .skip(skipValue)
    .limit(dogsPerPage)
    .then((yourDogs) => res.status(201).json({ yourDogs }))
    .catch((err) => {
      console.log(err);
      res.status(401).json("Error connecting to database.");
    });
}

export async function api_youradopteddogs_get(req, res) {
  let { page } = req.params;
  let { currentUserId } = req.body;

  const dogsPerPage = 10;
  page = parseInt(page);
  let previous = (page - 1).toString();
  let next = (page + 1).toString();

  let skipValue = 0;

  if (page > 1) {
    skipValue = (page - 1) * dogsPerPage;
  }

  const yourDogs = await Dog.find({
    $and: [{ newOwnerId: currentUserId }],
  })
    .skip(skipValue)
    .limit(dogsPerPage)
    .then((yourDogs) => res.status(201).json({ yourDogs }))
    .catch((err) => {
      console.log(err);
      res.status(401).json("Error connecting to database.");
    });
}
