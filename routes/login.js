const express = require("express");
let router = express.Router();

router.route("/").get((req, res) => {
  res.render("login");
});

module.exports = router;
