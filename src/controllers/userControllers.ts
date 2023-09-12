import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../connection/database";
import { QueryResult } from "pg";

export const userSignup= async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { fullname } = req.body;
  const { email } = req.body;
  const { password } = req.body;

  try {
    const response: QueryResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);

    if(response.rows.length > 0) {
        return res.status(201).json({message: "user exists"})
    }
        const hashPassword = await bcrypt.hash(password, 10);
        
        const newUser= await db.query("INSERT INTO users (fullname,email,Password) VALUES ($1,$2,$3) RETURNING id", [fullname, email, hashPassword]);
        
        const token = jwt.sign({userId: newUser.rows[0].id},"jbl", {expiresIn: "1hr"});

        return res.status(200).json({message: "User added successfully", token: token});
    } 
catch (error) {
    console.log(error);
    return res.status(500).json({message:"Internal Server Error"});
  }
};

