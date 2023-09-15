import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";


// Custom middleware for JWT validation
function validateToken(req:Request, res:Response, next: NextFunction) {
  const token = req.body.token;

  try {
    const decodedToken = jwt.verify(token, "your-secret-key");
    req.user = decodedToken; 
    next(); 
  } catch (error) {
    console.error("Error verifying token:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}


export default validateToken;