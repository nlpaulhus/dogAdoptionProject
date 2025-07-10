import { Router } from "express";
let router = Router();
import { api_youradopteddogs_get } from "../controllers/apiDogController.js";

router.get("/:page", api_youradopteddogs_get);

export default router;
