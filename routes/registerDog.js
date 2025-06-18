const express = require("express");
let router = express.Router();
let { registerdog_post } = require("../controllers/dogController");
const { requireAuth, isLoggedIn } = require("../middlewares/authMiddleWare");

router
  .route("/")
  .get(requireAuth, isLoggedIn, (req, res) => {
    let isLoggedIn = res.locals.isLoggedIn;
    res.render("registerDog", { isLoggedIn });
  })
  .post(requireAuth, isLoggedIn, (req, res) => registerdog_post(req, res));

module.exports = router;
