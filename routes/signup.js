const express = require("express");
let router = express.Router();
const { signup_post } = require("../controllers/authController");
const { isLoggedIn } = require("../middlewares/authMiddleWare");

router
  .route("/")
  .get(isLoggedIn, (req, res) => {
    let isLoggedIn = res.locals.isLoggedIn;
    res.render("signup", { isLoggedIn });
  })
  .post((req, res) => signup_post(req, res));

module.exports = router;
