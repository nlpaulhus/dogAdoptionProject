const express = require("express");
let router = express.Router();
const { login_post } = require("../controllers/authController");

router
  .route("/")
  .get((req, res) => {
    let isLoggedIn = false;
    res.render("login", { isLoggedIn });
  })
  .post((req, res) => login_post(req, res));

module.exports = router;
