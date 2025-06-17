const express = require("express");
let router = express.Router();
const { requireAuth, isLoggedIn } = require("../middlewares/authMiddleWare");
const Dog = require("../models/dog");
const { adopt_patch, adopt_get } = require("../controllers/dogController");

router
  .put("/", requireAuth, isLoggedIn, adopt_patch)
  .get("/:dogId", requireAuth, isLoggedIn, adopt_get);

module.exports = router;
