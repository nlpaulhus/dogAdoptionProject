import { Router } from "express";
let router = Router();
import requireAuth from "../middlewares/requireAuth.js";
import { api_dog_delete } from "../controllers/apiDogController.js";

router.route("/").delete(requireAuth, api_dog_delete);

export default router;
