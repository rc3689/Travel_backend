import { Router } from "express";
import {
  createTripValidator,
  inviteCollaboratorValidator,
} from "../validators/trip.js";
import {
  create,
  findAll,
  findById,
  update,
  remove,
  addExpenses,
  inviteCollaborator,
  acceptInvitation,
  uploadFiles,
  deleteFile,
} from "../services/trip.js";
import { useValidator } from "../middlewares/useValidator.js";
import multer from "multer";
const router = Router();
const upload = multer({ dest: "uploads/" });

router.post("/", useValidator(createTripValidator), create);
router.get("/", findAll);
router.get("/:id", findById);
router.put("/:id", update);
router.delete("/:id", remove);
router.post("/:id/expenses", addExpenses);
router.post(
  "/:id/invite",
  useValidator(inviteCollaboratorValidator),
  inviteCollaborator
);
router.get("/:id/invite/accept", acceptInvitation);
router.post("/:id/files", upload.array("files"), uploadFiles);
router.delete("/:id/files", deleteFile);

export default router;
