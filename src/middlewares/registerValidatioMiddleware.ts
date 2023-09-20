import { Request, Response, NextFunction } from "express";
import { body, validationResult, Result, ValidationError } from "express-validator";
import db from "../connection/database";
import bcrypt from "bcryptjs";

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


export const loginFieldsCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    // Check if the email exists in the database
    const userQuery = await db.query('SELECT * FROM users WHERE email = $1', [
      email,
    ]);

    const user = userQuery.rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Email not found' });
    }

    // Compare the provided password with the hashed password from the database
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // If validation is successful, attach the user information to the request
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};

