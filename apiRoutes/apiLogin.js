import { Router } from "express";
let router = Router();
import { api_login_post } from "../controllers/apiAuthController"

router
  .route("/")
  .get((req, res) => {
    let isLoggedIn = false;
    res.render("login", { isLoggedIn });
  })
  .post((req, res) => api_login_post(req, res));

export default router;
