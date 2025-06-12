const express = require("express");
let router = express.Router();
const { login_post } = require("../controllers/authController");

router
  .route("/")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => login_post(req, res));

module.exports = router;
