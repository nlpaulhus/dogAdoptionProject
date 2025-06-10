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

const register_dog = async (req, res) => {
  const { name, description } = req.body;
  const status = "adoptable";

  try {
    const newDog = await Dog.create({ name, description, status });
    return res.render("adoptableDogs");
  } catch (err) {
    const errors = handleErrors(err);
    console.log(errors);
    return res.render("registerDog", {
      nameError: errors.name,
      descriptionError: errors.description,
    });
  }
};

module.exports = { register_dog };
