const express = require("express");
let router = express.Router();
const { logout_get } = require("../controllers/authController");

router.route("/").get((req, res) => logout_get(req, res));

module.exports = router;
