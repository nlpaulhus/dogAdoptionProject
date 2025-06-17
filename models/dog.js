const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dogSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter the dog's name"],
  },
  description: {
    type: String,
    required: [true, "Please enter a short description of the dog"],
  },
  owner: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: [true],
  },
  ownerMessage: {
    type: String,
  },
});

const Dog = mongoose.model("dog", dogSchema);

module.exports = Dog;
