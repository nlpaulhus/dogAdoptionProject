const mongoose = require("mongoose");

function mongooseConnectDB(uri) {
  mongoose
    .connect(uri)
    .then((result) => console.log("Connected to database"))
    .catch((err) => console.log(err));
}

module.exports = mongooseConnectDB;
