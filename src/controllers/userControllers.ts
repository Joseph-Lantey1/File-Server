import { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../connection/database";
import { QueryResult } from "pg";
import { AuthenticationError } from "../middlewares/errorHandlingMiddleware";

// Render the signup page
export const signup = async (req: Request, res: Response) => {
  res.render("signup");
}

// Render the login page
export const login = async (req: Request, res: Response) => {
  res.render("login");
}

export const renderUserDashboard = (req: Request, res: Response) => {
  res.render("userDashboard");
};

export const renderAdminDashboard = (req: Request, res: Response) => {
  res.render("adminDashboard");
};

// Handle user signup
export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
  const { fullname } = req.body;
  const { email } = req.body;
  const { password } = req.body;

  try {
    // Check if the user with the provided email already exists
    const response: QueryResult = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (response.rows.length > 0) {
      throw new AuthenticationError("User exists");
    }

    // Hash the user's password before storing it
    const hashPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    const newUser = await db.query(
      "INSERT INTO users (fullname, email, password) VALUES ($1, $2, $3) RETURNING id",
      [fullname, email, hashPassword]
    );

    // Generate a JSON Web Token (JWT) for the new user
    const token = jwt.sign({ userId: newUser.rows[0].id }, process.env.SECRET_KEY as string, {
      expiresIn: "1hr",
    });

    // Render the login page after successful signup
    return res
      .status(200)
      .render("login", { token: token });
  } catch (error) {
    next(error); // Pass the error to the errorHandlingMiddleware
  }
};

// Handle user login
export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const { password } = req.body;

  try {
    // Check if a user with the provided email exists
    const response: QueryResult = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const existingUser = response.rows[0];

    if (!existingUser) {
      // Display an alert message for "No user found"
      res.status(401).render("login", { alertMessage: "No user found" });
      return;
    }

    // Compare the provided password with the stored hashed password
    const validPassword: any = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!validPassword) {
      // Display an alert message for "Invalid password"
      res.status(401).render("login", { alertMessage: "Invalid password" });
      return;
    }

    // Check if the user is an admin and render the admin dashboard, otherwise render the user dashboard
    if (existingUser.type === "admin") {
      return res.status(200).render("adminDashboard", { admin: 'Hi, Admin' });
    }
    return res.status(200).render("userDashboard", { user: existingUser.fullname });

  } catch (error) {
    next(error); // Pass the error to the errorHandlingMiddleware
  }
};
