import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../connection/database";
import nodemailer from "nodemailer";

export const forgotPassword = async (req: Request, res: Response) => {
    res.render("forgotPassword");
};

export const resetPasswordPage = (req: Request, res: Response) => {
    const { token } = req.query;
    res.render("resetPasswordPage", { token });
};

export const resetPassword = async (req: Request, res: Response) => {
    const userEmail = req.body.email;

    console.log(req.body);

    try {
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
            userEmail,
        ]);
        const existingUser = result.rows[0];

        if (!existingUser) {
            return res.status(404).json({ message: "Email not found" });
        }

        const resetToken = jwt.sign({ userId: existingUser.id }, "jbl", {
            expiresIn: "1h",
        });

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "lizyfileshare@gmail.com",
                pass: process.env.GMAIL_PASSWORD2,
            },
        });

        const link = `${req.hostname}:5000/api/reset-password?token=${resetToken}`;
       
        const mailOptions = {
            from: "lizyfileshare@gmail.com",
            to: userEmail,
            subject: "Password Reset Link",
            html: `<p>Please click on the link to reset your password: <a href="${link}">${link}</a></p>`,
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending mail", error);
                return res.status(500).json({ message: "Error sending mail" });
            } else {
                console.log("Email sent successfully", info.response);
                return res.status(200).json({ message: "Email sent successfully" });
            }
        });

    } catch (error) {
        console.error("Error resetting password:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const resetNewPassword = async (req: Request, res: Response) => {
    const { token, password } = req.body;

    try {
        // Verify and decode the token
        const decodedToken = jwt.verify(token, "process.env.SECRET_KEY") as { userId: string };

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
