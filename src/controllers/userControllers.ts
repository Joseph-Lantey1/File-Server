import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../connection/database";
import { QueryResult } from "pg";


export const signup =async (req:Request, res:Response) => {
  res.render("signup")
}

export const userSignup = async (req: Request, res: Response) => {
  const { fullname } = req.body;
  const { email } = req.body;
  const { password } = req.body;

  try {
    const response: QueryResult = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (response.rows.length > 0) {
      return res.status(201).json({ message: "User exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await db.query(
      "INSERT INTO users ( fullname, email, password) VALUES ($1, $2, $3) RETURNING id",
      [fullname, email, hashPassword]
    );

    const token = jwt.sign({ userId: newUser.rows[0].id }, "jbl", {
      expiresIn: "1hr",
    });

    return res
      .status(200)
      .json({ message: "User added successfully", token: token });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userLogin = async (req: Request, res: Response) => {
  const { email } = req.body;
  const { password } = req.body;

  try {
    const response: QueryResult = await db.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    const existingUser = response.rows[0];

    if (!existingUser) {
      return res.status(400).json({ message: "No user found" });
    }

    const validPassword: any = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!validPassword) {
      return res.status(401).json({ message: "Invalid password" });
    }

    if(existingUser.type === "admin"){
      return res.status(200).render("adminDashboard", {admin: 'Hi,Admin'})
    }
    // return res.status(200).json({ message: "User Logged in" });
    return res.status(200).render("userDashboard", {user: 'extingUser.fullname'});
  } catch (error) {
    console.log(error);
    return res.status(500).json("Internal Server Error");
  }
};
