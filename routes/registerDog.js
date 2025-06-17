const express = require("express");
let router = express.Router();
let { register_dog } = require("../controllers/dogController");
const { requireAuth, isLoggedIn } = require("../middlewares/authMiddleWare");

router
  .route("/")
  .get(requireAuth, isLoggedIn, (req, res) => {
    let isLoggedIn = res.locals.isLoggedIn;
    res.render("registerDog", { isLoggedIn });
  })
  .post(requireAuth, (req, res) => register_dog(req, res));

module.exports = router;
