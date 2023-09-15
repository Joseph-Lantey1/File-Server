import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../connection/database";
import nodemailer from 'nodemailer';


export const reset =async (req:Request, res:Response) => {
    res.render("reset");
}

export const resetPasswordPage = (req: Request, res: Response) => {
    const { token } = req.query;
    res.render("resetPasswordPage", { token });
  };


export const resetPassword = async (req: Request, res: Response) => {
    const { email } = req.body;

    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
        const existingUser = result.rows[0];

        if (!existingUser) {
            return res.status(404).json({ message: "Email not found" })
        }

        const resetToken = jwt.sign({ userId: existingUser }, "jbl", { expiresIn: "1h" })

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "lizyfileshare@gmail.com",
                pass: "mtaoxkalhokhxfme",
            },
        });

        const link = `http://localhost:5000/api/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: "lizyfileshare@gmail.com",
            to: email,
            subject: "Password Reset Link",
            html: `<p>Please click on the link to reset your password: <a href="${link}">${link}</a></p>`,
        };

        transporter.sendMail(mailOptions, (error: any, info: { response: string; }) => {
            if (error) {
                console.log(error);
            } else {
                console.log("Email sent: " + info.response);
            }
        });
    } catch (error) {
        console.error("Error deleting file:", error);
        return res.status(500).json({ message: "Error deleting file" });
    }
}


export const resetNewPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;
  
    try {
      // Verify and decode the token
      const decodedToken = jwt.verify(token, "jbl") as { userId: string };
  
      // Update the user's password in the database
      const hashedPassword = await bcrypt.hash(password, 10);
      await db.query("UPDATE users SET password = $1 WHERE id = $2", [
        hashedPassword,
        decodedToken.userId,
      ]);
  
      // Redirect to the login page or a success page
      res.redirect("/api/login");
    } catch (error) {
      console.error("Error resetting password:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  