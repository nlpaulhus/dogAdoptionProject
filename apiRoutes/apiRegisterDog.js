import { Router } from "express";
let router = Router();
import { api_registerdog_post } from "../controllers/apiDogController.js";

router.post("/", (req, res) => api_registerdog_post(req, res));

export default router;
