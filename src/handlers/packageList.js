import { Router } from "express";
import {
  create,
  findAll,
  findById,
  update,
  remove,
} from "../services/packageList.js";
import { createPackageList } from "../validators/packageList.js";
import { useValidator } from "../middlewares/useValidator.js";

const router = Router();

router.post("/", useValidator(createPackageList), create);
router.get("/", findAll);
router.get("/:id", findById);
router.patch("/:id", update);
router.delete("/:id", remove);

export default router;
