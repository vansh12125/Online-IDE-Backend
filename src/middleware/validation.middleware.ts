import { body, validationResult, Result } from "express-validator";
import type { ValidationError } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import { ErrorResponse } from "../utils";
import { Languages } from "../enums";

async function validateResult(req: Request, res: Response, next: NextFunction) {
  const errors: Result<ValidationError> = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      status: 400,
      errors: errors.array(),
      message: "Validation Error",
    } as ErrorResponse);
  }

  next();
}

//User Validation

const registerUserValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .bail()
    .isString()
    .withMessage("Username must be string")
    .isLength({ min: 3, max: 25 })
    .withMessage("Username must be between 3 to 25 characters")
    .matches(/^[a-zA-Z][a-zA-Z0-9_]{3,24}$/)
    .withMessage(
      "Username must start with a letter and contain only letters, numbers, or underscores",
    ),

  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .bail()
    .isString()
    .withMessage("Password must be string")
    .isLength({ min: 8 })
    .withMessage("Passoword Should be of minimun length, 8"),

  body("name")
    .notEmpty()
    .withMessage("Name cannot be empty")
    .bail()
    .isString()
    .withMessage("Name must be string")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 to 50 characters"),

  body("email")
    .notEmpty()
    .withMessage("Email cannot be empty")
    .bail()
    .isString()
    .withMessage("Email must be string")
    .isEmail()
    .withMessage("Enter Valid Email"),

  validateResult,
];

const loginUserValidation = [
  body("username")
    .notEmpty()
    .withMessage("Username cannot be empty")
    .bail()
    .isString()
    .withMessage("Username must be string")
    .isLength({ min: 3, max: 25 })
    .withMessage("Username must be between 3 to 25 characters")
    .matches(/^[a-zA-Z][a-zA-Z0-9_]{3,24}$/)
    .withMessage(
      "Username must start with a letter and contain only letters, numbers, or underscores",
    ),

  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .bail()
    .isString()
    .withMessage("Password must be string")
    .isLength({ min: 8 })
    .withMessage("Passoword Should be of minimun length, 8"),

  validateResult,
];

const deleteUserValidation = [
  body("password")
    .notEmpty()
    .withMessage("Password cannot be empty")
    .bail()
    .isString()
    .withMessage("Password must be string")
    .isLength({ min: 8 })
    .withMessage("Passoword Should be of minimun length, 8"),

  validateResult,
];

//Project Validation

const createProjectValidation = [
  body("projectName")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .bail()
    .isLength({ min: 1, max: 50 })
    .withMessage("Project name must be between 1 and 50 characters"),

  body("language")
    .trim()
    .notEmpty()
    .withMessage("Language is required")
    .bail()
    .isIn(Object.values(Languages))
    .withMessage("Invalid language"),

  validateResult,
];

export {registerUserValidation,loginUserValidation,deleteUserValidation,createProjectValidation}