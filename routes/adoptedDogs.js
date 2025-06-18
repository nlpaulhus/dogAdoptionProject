const express = require("express");
let router = express.Router();
const { requireAuth, isLoggedIn } = require("../middlewares/authMiddleWare");
const { adopted_get } = require("../controllers/dogController");

router.route("/:page").get(requireAuth, isLoggedIn, adopted_get);

module.exports = router;
