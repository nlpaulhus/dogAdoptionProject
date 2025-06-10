const express = require("express");
let router = express.Router();

router.route("/").get((req, res) => {
  let adoptableDogs = [
    { name: "Sadie", description: "The Best" },
    { name: "Goli", description: "Super cute" },
    { name: "Mochi", description: "nervous" },
  ];
  res.render("adoptableDogs", { adoptableDogs });
});

module.exports = router;
