import { Router } from "express";
import { create } from "../services/user.js";
import { useValidator } from "../middlewares/useValidator.js";
import { createUserValidator } from "../validators/user.js";

const router = Router();

router.post("/", useValidator(createUserValidator), create);

export default router;
