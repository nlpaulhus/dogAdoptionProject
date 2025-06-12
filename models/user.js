const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { isEmail } = require("validator");
const bcrypt = require("bcrypt");

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
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  this.email = this.email.toLowerCase();
  next();
});

userSchema.statics.login = async function (email, password) {
  try {
    const user = await this.findOne({ email });
    const auth = bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    } else {
      throw new Error("invalid login credentials");
    }
  } catch (err) {
    console.log(err);
  }
};

//   if (!user) {
//     errors.email = "Email address is not associated with a valid account.";
//     return errors;
//   }
//   const auth = bcrypt.compare(password, user.password);
// if (!auth) {
//   errors.password = "Incorrect password";
//   return errors;
// } else {
//   return user;
// }

const User = mongoose.model("user", userSchema);

module.exports = User;
