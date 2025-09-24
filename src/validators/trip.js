import { body } from "express-validator";

export const createTripValidator = [
  body("title").trim().notEmpty().withMessage("Title is required"),
  body("startDate")
    .trim()
    .notEmpty()
    .withMessage("Start date is required")
    .isDate()
    .withMessage("Start date must be a date"),
  body("endDate")
    .trim()
    .notEmpty()
    .withMessage("End date is required")
    .isDate()
    .withMessage("End date must be a date")
    .custom((value, { req }) => {
      if (value < req.body.startDate) {
        throw new Error("End date must be after start date");
      }
      return true;
    }),
  body("destinations")
    .trim()
    .isArray()
    .withMessage("Destinations must be an array"),
  body("budget.total")
    .trim()
    .isNumeric()
    .withMessage("Budget must be a number"),
  body("budget.spent")
    .trim()
    .isNumeric()
    .withMessage("Spent amount must be a number"),
  body("budget.expenses")
    .optional()
    .isArray()
    .withMessage("Expenses must be an array"),
  body("budget.expenses.*.name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Expense name is required"),
  body("budget.expenses.*.amount")
    .optional()
    .trim()
    .isNumeric()
    .withMessage("Expense amount must be a number"),
];

export const inviteCollaboratorValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isArray()
    .withMessage("Email must be an array"),
  body("email.*")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email address"),
];
