import { Router } from "express";
let router = Router();
import isLoggedIn from "../middlewares/isLoggedIn.js"

router.route("/").get(isLoggedIn, (req, res) => {
  let isLoggedIn = res.locals.isLoggedIn;
  const token = req.cookies.jwt;

  if (isLoggedIn) {
    res.render("loggedIn", { isLoggedIn });
  } else {
    res.render("index", { isLoggedIn });
  }
});

export default router;
