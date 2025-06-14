const express = require("express");
let router = express.Router();
const { requireAuth } = require("../middlewares/authMiddleWare");
const Dog = require("../models/dog");
const {adoptable_get} = require("../controllers/dogController");

router.route("/").get(requireAuth, adoptable_get);

module.exports = router;
