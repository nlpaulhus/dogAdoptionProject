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
  status: {
    type: String,
    required: [true],
  },
});

const Dog = mongoose.model("dog", dogSchema);

module.exports = Dog;
