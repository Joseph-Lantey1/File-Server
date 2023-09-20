import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../connection/database";
import nodemailer from "nodemailer";

// Render the forgot password page
export const forgotPassword = async (req: Request, res: Response) => {
    res.render("forgotPassword");
};

// Handle the reset password request
export const resetPassword = async (req: Request, res: Response) => {
    const userEmail = req.body.email;

    console.log(req.body);

    try {
        // Check if the user with the provided email exists
        const result = await db.query("SELECT * FROM users WHERE email = $1", [
            userEmail,
        ]);
        const existingUser = result.rows[0];

        if (!existingUser) {
            return res.status(404).json({ message: "Email not found" });
        }

        // Generate a reset token that expires in 1 hour
        const resetToken = jwt.sign({ userId: existingUser.id }, process.env.SECRET_KEY as string, {
            expiresIn: "1h",
        });

        // Store the token in your database
        await db.query(
            "INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3) RETURNING id",
            [
                existingUser.id,
                resetToken,
                new Date(Date.now() + 7000000), // 1 hour expiration
            ]
        );

        // Create a transporter for sending emails
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "lizyfileshare@gmail.com",
                pass: process.env.GMAIL_PASSWORD2,
            },
        });

        const link = `http://${req.hostname}:5000/api/reset-password?token=${resetToken}`;

        const mailOptions = {
            from: "lizyfileshare@gmail.com",
            to: userEmail,
            subject: "Password Reset Link",
            html: `<p>Please click on the link to reset your password: <a href="${link}">${link}</a></p>`,
        };

        // Send the email with the reset link
        transporter.sendMail(mailOptions, (error: Error | null, info: nodemailer.SentMessageInfo) => {
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

// Render the reset password page
export const resetPasswordPage = async (req: Request, res: Response) => {
    const { token } = req.query; // Retrieve the token from the query params

    // Retrieve the token from the database
    const result = await db.query(
        "SELECT * FROM password_reset_tokens WHERE token = $1",
        [token]
    );

    console.log(req.query);

    const { expires_at } = result.rows[0];

    if (result.rowCount === 0 || expires_at < new Date()) {
        return res.status(401).json({ message: "Token is invalid or expired" });
    }

    // Render the reset password page with the token
    res.render("resetPasswordPage", { token: token }); // Pass the token from the database
};

// Handle the submission of the new password
export const resetNewPassword = async (req: Request, res: Response) => {
    const newPassword = req.body.password;
    const token = req.body.token; // Retrieve the token from the form body

    console.log(token);

    try {
        // Check if the reset token exists in the database
        const result = await db.query(
            "SELECT * FROM password_reset_tokens WHERE token = $1",
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({ message: "Token is invalid or expired" });
        }

        const userId = result.rows[0].user_id;

        // Update the user's password in the database with the new hashed password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query("UPDATE users SET password = $1 WHERE id = $2", [
            hashedPassword,
            userId,
        ]);

        // Delete the used token from the database
        await db.query("DELETE FROM password_reset_tokens WHERE token = $1", [
            token,
        ]);

        // Redirect to the login page
        res.redirect("/api/login");
    } catch (error) {
        console.error("Error resetting password:", error);
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
