import { Router } from "express";
let router = Router();
import {
  api_yourdogs_get,
  api_yourdogs_adoptable_get,
  api_yourdogs_adopted_get,
} from "../controllers/apiDogController.js";

router
  .get("/:page", api_yourdogs_get)
  .get("/adoptable/:page", api_yourdogs_adoptable_get)
  .get("/adopted/:page", api_yourdogs_adopted_get);

export default router;
