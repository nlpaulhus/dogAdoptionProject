import { Router } from "express";
let router = Router();
import requireAuth from "../middlewares/requireAuth.js";
import isLoggedIn from "../middlewares/isLoggedIn.js"
import { api_adopted_get } from "../controllers/apiDogController.js";

router.route("/:page").get(requireAuth, isLoggedIn, api_adopted_get);

export default router;
