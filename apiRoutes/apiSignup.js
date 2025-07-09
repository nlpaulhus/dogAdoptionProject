import { Router } from "express";
let router = Router();
import { api_signup_post } from "../controllers/apiAuthController.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";

router
  .route("/")
  .get(isLoggedIn, (req, res) => {
    let isLoggedIn = res.locals.isLoggedIn;
    res.render("signup", { isLoggedIn });
  })
  .post((req, res) => api_signup_post(req, res));

export default router;
