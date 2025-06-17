const express = require("express");
let router = express.Router();
const { requireAuth } = require("../middlewares/authMiddleWare");
const Dog = require("../models/dog");
const { dog_delete } = require("../controllers/dogController");

router.route("/").delete(requireAuth, dog_delete);

module.exports = router;
