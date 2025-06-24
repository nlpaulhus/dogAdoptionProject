import { Router } from "express";
let router = Router();
import { logout_get } from "../controllers/authController.js";

router.route("/").get((req, res) => logout_get(req, res));

export default router;
