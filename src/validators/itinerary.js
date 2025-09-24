import { body } from "express-validator";

export const createItineraryValidator = [
  body("tripId")
    .trim()
    .notEmpty()
    .withMessage("Trip is required")
    .isMongoId()
    .withMessage("Trip must be a valid MongoDB ID"),
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("description").trim().optional(),
  body("date")
    .trim()
    .notEmpty()
    .withMessage("Date is required")
    .isDate()
    .withMessage("Date must be a date"),
  body("activities").isArray().withMessage("Activities must be an array"),
  body("activities.*.name")
    .trim()
    .notEmpty()
    .withMessage("Activity name is required"),
  body("activities.*.time")
    .trim()
    .notEmpty()
    .withMessage("Activity time is required"),
  body("activities.*.notes")
    .trim()
    .isArray()
    .withMessage("Notes must be an array"),
  body("activities.*.notes.*")
    .trim()
    .notEmpty()
    .withMessage("Note is required"),
];
