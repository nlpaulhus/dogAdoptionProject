import { Router } from "express";
let router = Router();
import { api_login_post } from "../controllers/apiAuthController.js";

router
  .post("/",(req, res) => api_login_post(req, res));

export default router;
