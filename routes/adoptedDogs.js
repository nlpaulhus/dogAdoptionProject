const express = require("express");
let router = express.Router();
const { requireAuth } = require("../middlewares/authMiddleWare");

router.route("/").get(requireAuth, (req, res) => {
  let adoptedDogs = [
    { name: "Sadie", description: "The Best" },
    { name: "Goli", description: "Super cute" },
    { name: "Mochi", description: "nervous" },
  ];
  res.render("adoptedDogs", { adoptedDogs });
});

module.exports = router;
