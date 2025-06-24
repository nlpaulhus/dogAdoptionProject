import { Router } from "express";
let router = Router();
import { registerdog_post } from "../controllers/dogController.js";
import requireAuth from "../middlewares/requireAuth.js";
import isLoggedIn from "../middlewares/isLoggedIn.js"

router
  .route("/")
  .get(requireAuth, isLoggedIn, (req, res) => {
    let isLoggedIn = res.locals.isLoggedIn;
    res.render("registerDog", { isLoggedIn });
  })
  .post(requireAuth, isLoggedIn, (req, res) => registerdog_post(req, res));

export default router;
