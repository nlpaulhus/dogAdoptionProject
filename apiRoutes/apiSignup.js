import { Router } from "express";
let router = Router();
import { api_signup_post } from "../controllers/apiAuthController.js";

router.post("/", (req, res) => api_signup_post(req, res));

export default router;
