import mongoose from "mongoose";
const { Schema } = mongoose;
import pkg from "validator";
const { isEmail } = pkg;
import { genSalt, hash } from "bcrypt";

const userSchema = new Schema({
  email: {
    type: String,
    required: [true, "Please enter a valid email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please enter a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please enter a password"],
    minlength: [12, "Minimum password length is 12 characters"],
  },
});

userSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  this.email = this.email.toLowerCase();
  next();
});

const User = mongoose.model("User", userSchema);

export default User;
