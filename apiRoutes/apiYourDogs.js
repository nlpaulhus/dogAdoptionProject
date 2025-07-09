import { Router } from "express";
let router = Router();
import requireAuth from "../middlewares/requireAuth.js";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import {
  api_yourdogs_get,
  api_yourdogs_adoptable_get,
  api_yourdogs_adopted_get,
} from "../controllers/apiDogController.js";

router
  .get("/:page", requireAuth, isLoggedIn, api_yourdogs_get)
  .get("/adoptable/:page", requireAuth, isLoggedIn, api_yourdogs_adoptable_get)
  .get("/adopted/:page", requireAuth, isLoggedIn, api_yourdogs_adopted_get);

export default router;
