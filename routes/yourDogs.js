const express = require("express");
let router = express.Router();
const { requireAuth, isLoggedIn } = require("../middlewares/authMiddleWare");
const Dog = require("../models/dog");
const {
  yourdogs_get,
  yourdogs_adoptable_get,
  yourdogs_adopted_get,
} = require("../controllers/dogController");

router
  .get("/:page", requireAuth, isLoggedIn, yourdogs_get)
  .get("/adoptable/:page", requireAuth, isLoggedIn, yourdogs_adoptable_get)
  .get("/adopted/:page", requireAuth, isLoggedIn, yourdogs_adopted_get);

module.exports = router;
