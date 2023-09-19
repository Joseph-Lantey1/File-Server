import { Request, Response } from "express";
import path from "path";
import nodemailer from "nodemailer";
import fs from "fs";
import db from "../connection/database";

// Render the upload page
export const renderUploadPage = (req: Request, res: Response) => {
  res.render("user"); // Renders the "user" view
};

// Handle file download
export const download = async (req: Request, res: Response) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads/", filename);
    console.log(filePath);

    if (!filename) {
      return res.status(400).json({ message: "file not found" });
    }

    res.download(filePath); // Trigger file download for the client

    // Update the download count in the database
    const result = await db.query("SELECT * FROM files WHERE id = $1 LIMIT 1", [
      req.query.id,
    ]);

    const oldCount = result.rows[0].downloads;

    await db.query("UPDATE files SET downloads = $1 WHERE id= $2", [
      oldCount + 1,
      req.query.id,
    ]);
  } catch (error) {
    console.error("Error downloading file", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Send file download link via email
export const emailDownload = async (req: Request, res: Response) => {
  try {
    const userEmail = req.body.email;
    const filename: string = req.params.filename;
    const filePath: string = path.join("dist", "uploads", filename);

    // Check if the file exists
    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);
      return res.status(404).json({ message: "File not found" });
    }

    // Parse the 'id' from the query parameters
    const fileId = req.query.id as string;

    // Fetch the file data including 'emailsent' count
    const result = await db.query("SELECT * FROM files WHERE id = $1 LIMIT 1", [
      fileId,
    ]);

    if (result.rows.length === 0) {
      console.error("File not found in the database:", fileId);
      return res
        .status(404)
        .json({ message: "File not found in the database" });
    }

    const oldCount = result.rows[0].emailsent;

    // Update the 'emailsent' count for the specific file
    await db.query("UPDATE files SET emailsent = $1 WHERE id = $2", [
      oldCount + 1,
      fileId,
    ]);

    // After updating the count, send the email
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "lizyfileshare@gmail.com",
        pass: process.env.GMAIL_PASSWORD1,
      },
    });

    const mailOptions = {
      from: "lizyfileshare@gmail.com",
      to: userEmail,
      subject: "File Download",
      text: "Attached is your requested file.",
      attachments: [
        {
          filename: filename,
          path: filePath,
        },
      ],
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
    console.error("Error in emailDownload:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
