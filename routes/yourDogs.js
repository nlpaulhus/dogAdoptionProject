import { Router } from "express";
let router = Router();
import requireAuth from "../middlewares/requireAuth.js";
import isLoggedIn from "../middlewares/isLoggedIn.js"
import {
  yourdogs_get,
  yourdogs_adoptable_get,
  yourdogs_adopted_get,
} from "../controllers/dogController.js";

router
  .get("/:page", requireAuth, isLoggedIn, yourdogs_get)
  .get("/adoptable/:page", requireAuth, isLoggedIn, yourdogs_adoptable_get)
  .get("/adopted/:page", requireAuth, isLoggedIn, yourdogs_adopted_get);

export default router;
