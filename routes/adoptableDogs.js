const express = require("express");
let router = express.Router();
const { requireAuth, isLoggedIn } = require("../middlewares/authMiddleWare");
const Dog = require("../models/dog");
const { adoptable_get } = require("../controllers/dogController");

router.route("/").get(requireAuth, isLoggedIn, adoptable_get);

module.exports = router;
