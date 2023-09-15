import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../connection/database";
import nodemailer from 'nodemailer';


export const reset =async (req:Request, res:Response) => {
    res.render("reset");
}


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

        const link = `http://localhost:5000/reset-password?token=${resetToken}`;

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