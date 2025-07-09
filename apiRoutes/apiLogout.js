import { Router } from "express";
let router = Router();
import { api_logout_get } from "../controllers/apiAuthController.js";

router.route("/").get((req, res) => api_logout_get(req, res));

export default router;
