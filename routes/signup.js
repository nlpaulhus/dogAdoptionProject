const express = require("express");
let router = express.Router();
const { signup_post } = require("../controllers/authController");

router
  .route("/")
  .get((req, res) => {
    res.render("signup", { error: { email: "", password: "" } });
  })
  .post((req, res) => signup_post(req, res));

module.exports = router;
