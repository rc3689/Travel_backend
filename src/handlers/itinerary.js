import { Router } from "express";
import {
  createItinerary,
  findAll,
  findById,
  update,
  remove,
} from "../services/itinerary.js";
import { createItineraryValidator } from "../validators/itinerary.js";
import { useValidator } from "../middlewares/useValidator.js";

const router = Router();

router.post(
  "/:tripId",
  useValidator(createItineraryValidator),
  createItinerary
);
router.get("/:tripId", findAll);
router.get("/:tripId/:id", findById);
router.patch("/:tripId/:id", update);
router.delete("/:tripId/:id", remove);

export default router;
