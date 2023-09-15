import { Request, Response, NextFunction } from "express";
import { body, validationResult, Result, ValidationError } from "express-validator";

export default class UserRegisterValidationMiddleware {
  static validate() {
    return [
      body("fullname")
        .isLength({ min: 3 })
        .withMessage('Fullname must be at least 3 characters')
        .exists()
        .withMessage('Fullname is required')
        .trim()
        .escape(), // Escape the username

      body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid Email')
        .exists(),

      body("password")
        .isLength({ min: 5, max: 30 })
        .withMessage('Password must be between 5 and 30 characters long')
        .matches(/\d/)
        .withMessage('Password must contain a number')
        .exists()
        .escape(), // Escape the password

      (req: Request, res: Response, next: NextFunction): void => {
        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({
            success: false,
            errors: errors.array(),
          });
        } else {
          next();
        }
      },
    ];
  }
}


