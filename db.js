import { connect } from "mongoose";

function mongooseConnectDB(uri) {
  connect(uri)
    .then((result) => console.log("Connected to database"))
    .catch((err) => console.log(err));
}

export default mongooseConnectDB;
