const express = require("express");
let router = express.Router();
let { register_dog } = require("../controllers/dogController");
const { requireAuth } = require("../middlewares/authMiddleWare");

router
  .route("/")
  .get(requireAuth, (req, res) => {
    let isLoggedIn = true;
    res.render("registerDog", { isLoggedIn });
  })
  .post(requireAuth, (req, res) => register_dog(req, res));

module.exports = router;
