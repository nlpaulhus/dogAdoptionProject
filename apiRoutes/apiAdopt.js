import { Router } from "express";
let router = Router();
import { api_adopt_patch } from "../controllers/apiDogController.js";

router.put("/", api_adopt_patch);

export default router;
