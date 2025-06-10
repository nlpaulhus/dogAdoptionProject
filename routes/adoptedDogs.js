const express = require("express");
let router = express.Router();

router.route("/").get((req, res) => {
  let adoptedDogs = [
    { name: "Sadie", description: "The Best" },
    { name: "Goli", description: "Super cute" },
    { name: "Mochi", description: "nervous" },
  ];
  res.render("adoptedDogs", { adoptedDogs });
});

module.exports = router;
