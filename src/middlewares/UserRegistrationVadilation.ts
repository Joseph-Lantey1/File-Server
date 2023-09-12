import { Request, Response, NextFunction } from 'express';
import { body, validationResult, Result, ValidationError } from 'express-validator';

class UserRegisterValidationMiddleware {
  static validate() {
    return [
      body("username")
        .isLength({ min: 4 })
        .withMessage('Username must be at least 4 characters')
        .exists()
        .withMessage('Username is required')
        .trim()
        .escape(), // Escape the username

      body("email")
        .isEmail()
        .normalizeEmail()
        .withMessage('Invalid Email')
        .exists(),

      body('password')
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

export default UserRegisterValidationMiddleware;
