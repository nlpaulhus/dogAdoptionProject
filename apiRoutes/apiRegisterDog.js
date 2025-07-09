import { Router } from "express";
let router = Router();
import { api_registerdog_post } from "../controllers/apiDogController.js";
import requireAuth from "../middlewares/requireAuth.js";
import isLoggedIn from "../middlewares/isLoggedIn.js"

router
  .route("/")
  .get(requireAuth, isLoggedIn, (req, res) => {
    let isLoggedIn = res.locals.isLoggedIn;
    res.render("registerDog", { isLoggedIn });
  })
  .post(requireAuth, isLoggedIn, (req, res) => api_registerdog_post(req, res));

export default router;
