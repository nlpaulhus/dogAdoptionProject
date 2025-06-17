const express = require("express");
let router = express.Router();
const { requireAuth } = require("../middlewares/authMiddleWare");
const Dog = require("../models/dog");
const { adopt_patch, adopt_get } = require("../controllers/dogController");

router
  .put("/", requireAuth, adopt_patch)
  .get("/:dogId", requireAuth, adopt_get);

module.exports = router;
