import { Router } from "express";
let router = Router();
import requireAuth from "../middlewares/requireAuth.js";
import isLoggedIn from "../middlewares/isLoggedIn.js"
import { adopt_patch, adopt_get } from "../controllers/dogController.js";

router
  .put("/", requireAuth, isLoggedIn, adopt_patch)
  .get("/:dogId", requireAuth, isLoggedIn, adopt_get);

export default router;
