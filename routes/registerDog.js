const express = require("express");
let router = express.Router();
let { register_dog } = require("../controllers/dogController");

router
  .route("/")
  .get((req, res) => {
    res.render("registerDog");
  })
  .post((req, res) => register_dog(req, res));

module.exports = router;
