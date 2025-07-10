import { Router } from "express";
let router = Router();
import { api_dog_delete } from "../controllers/apiDogController.js";

router.delete("/", api_dog_delete);

export default router;
