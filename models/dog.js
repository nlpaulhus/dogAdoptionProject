import mongoose from "mongoose";
const { Schema } = mongoose;

const dogSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please enter the dog's name."],
  },
  description: {
    type: String,
    required: [true, "Please enter a short description of the dog."],
  },
  owner: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  newOwnerId: {
    type: String,
  },
  ownerMessage: {
    type: String,
  },
});

const Dog = mongoose.model("dog", dogSchema);

export default Dog;
