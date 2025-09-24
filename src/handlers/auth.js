import { Router } from "express";
import { register, login } from "../services/auth.js";
import { useValidator } from "../middlewares/useValidator.js";
import { createUserValidator, loginUserValidator } from "../validators/user.js";

const router = Router();
router.post("/register", useValidator(createUserValidator), register);
router.post("/login", useValidator(loginUserValidator), login);

export default router;
