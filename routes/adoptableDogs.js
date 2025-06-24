import { Router } from "express";
let router = Router();
import requireAuth from "../middlewares/requireAuth.js";
import isLoggedIn from "../middlewares/isLoggedIn.js"
import Dog from "../models/dog.js";
import { adoptable_get } from "../controllers/dogController.js";

router.route("/:page").get(requireAuth, isLoggedIn, adoptable_get);

export default router;
