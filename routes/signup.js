import { Router } from "express";
let router = Router();
import { signup_post } from "../controllers/authController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js"

router
  .route("/")
  .get(isLoggedIn, (req, res) => {
    let isLoggedIn = res.locals.isLoggedIn;
    res.render("signup", { isLoggedIn });
  })
  .post((req, res) => signup_post(req, res));

export default router;
