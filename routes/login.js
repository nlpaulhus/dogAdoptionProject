import { Router } from "express";
let router = Router();
import { login_post } from "../controllers/authController.js";

router
  .route("/")
  .get((req, res) => {
    let isLoggedIn = false
    res.render("login", { isLoggedIn });
  })
  .post((req, res) => login_post(req, res));

export default router;
