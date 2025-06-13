const express = require("express");
let router = express.Router();
const { requireAuth } = require("../middlewares/authMiddleWare");

router.route("/").get(requireAuth, (req, res) => {
  let adoptableDogs = [
    { name: "Sadie", description: "The Best" },
    { name: "Goli", description: "Super cute" },
    { name: "Mochi", description: "nervous" },
  ];
  res.render("adoptableDogs", { adoptableDogs });
});

module.exports = router;
