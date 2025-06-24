import { Router } from "express";
let router = Router();
import requireAuth from "../middlewares/requireAuth.js";
import { dog_delete } from "../controllers/dogController.js";

router.route("/").delete(requireAuth, dog_delete);

export default router;
