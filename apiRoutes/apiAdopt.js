import { Router } from "express";
let router = Router();
import requireAuth from "../middlewares/requireAuth.js";
import isLoggedIn from "../middlewares/isLoggedIn.js"
import { api_adopt_patch, api_adopt_get } from "../controllers/apiDogController.js";

router
  .put("/", requireAuth, isLoggedIn, api_adopt_patch)
  .get("/:dogId", requireAuth, isLoggedIn, api_adopt_get);
 

export default router;
