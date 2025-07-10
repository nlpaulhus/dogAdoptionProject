import { connect } from "mongoose";

function mongooseConnectDB(uri) {
  connect(uri)
    .catch((err) => console.log(err));
}

export default mongooseConnectDB;
