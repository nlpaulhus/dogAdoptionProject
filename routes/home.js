const express = require("express");
let router = express.Router();
const jwt = require("jsonwebtoken");
const { isLoggedIn } = require("../middlewares/authMiddleWare");

router.route("/").get(isLoggedIn, (req, res) => {
  let isLoggedIn = res.locals.isLoggedIn;
  const token = req.cookies.jwt;

  if (isLoggedIn) {
    res.render("loggedIn", { isLoggedIn });
  } else {
    res.render("index", { isLoggedIn });
  }
});

module.exports = router;
