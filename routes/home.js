const express = require("express");
let router = express.Router();
const jwt = require("jsonwebtoken");

router.route("/").get((req, res) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, process.env.SESSION_SECRET, (err, decodedToken) => {
      if (err) {
        res.render("index", { isLoggedIn: false });
      } else {
        res.render("loggedIn", { isLoggedIn: true });
      }
    });
  } else {
    res.render("loggedIn", { isLoggedIn: true });
  }
});

module.exports = router;
