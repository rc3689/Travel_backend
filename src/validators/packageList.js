import { body } from "express-validator";

export const createPackageList = [
  body("name").trim().notEmpty().withMessage("Name is required"),
];
