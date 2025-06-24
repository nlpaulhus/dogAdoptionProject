import { Router } from "express";
let router = Router();
import requireAuth from "../middlewares/requireAuth.js";
import isLoggedIn from "../middlewares/isLoggedIn.js"
import { adopted_get } from "../controllers/dogController.js";

router.route("/:page").get(requireAuth, isLoggedIn, adopted_get);

export default router;
