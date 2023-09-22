import { NextFunction, Request, Response } from "express";
import path from "path";
import fs from "fs";
import multer from "multer";
import db from "../connection/database";
import { DatabaseError } from "../middlewares/errorHandlingMiddleware";

// Define the upload directory path
const uploadDirectory: string = path.join(__dirname, "../uploads");

// Check if the upload directory exists, and create it if it doesn't
if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory);
}

// Configure storage for file uploads using Multer
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, callback) => {
        callback(null, uploadDirectory);
    },
    filename: (req: Request, file: Express.Multer.File, callback) => {
        callback(null, file.originalname);
    },
});

// Create a Multer instance with the defined storage
export const upload = multer({ storage: storage });

// Handle file upload
export const uploadFile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            throw new DatabaseError("No file uploaded.");
        }
        const uploadedFile = req.file as Express.Multer.File;

        console.log(`Uploaded file: ${uploadedFile.originalname}`);

        const filename: string = uploadedFile.originalname;
        const description: string = req.body.description;

        // Insert the file details (filename and description) into the "files" table
        const insertFile: string =
            "INSERT INTO files (filename, description) VALUES ($1, $2) RETURNING id";
        const values: (string | number)[] = [filename, description];
        const result: any = await db.query(insertFile, values);
        const fileId: number = result.rows[0].id;

        return res.status(201).json({ id: fileId, filename, description });
    } catch (error) {
        next(error); // Pass the error to the errorHandlingMiddleware
    }
};

// Retrieve a list of uploaded files
export const getUploadedFiles = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const files = await db.query("SELECT * FROM files", []);
        res.status(200).json(files.rows);
    } catch (error) {
        next(error); // Pass the error to the errorHandlingMiddleware
    }
};

// Delete an uploaded file
export const deleteFile = async (req: Request, res: Response, next: NextFunction) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, "../uploads/", filename);

    try {
        // Check if the file exists before attempting to delete it
        if (!fs.existsSync(filePath)) {
            throw new DatabaseError("File not found");
        }

        // Delete the file from the file system
        fs.unlinkSync(filePath);

        // Delete the file record from the database
        const result = await db.query("DELETE FROM files WHERE filename = $1", [
            filename,
        ]);
        if (result.rowCount > 0) {
            res.status(200).json({ message: "File deleted successfully" });
        } else {
            throw new DatabaseError("File not found");
        }
    } catch (error) {
        next(error); // Pass the error to the errorHandlingMiddleware
    }
};

// Search for files by filename in the database
export const searchFile = async (req: Request, res: Response, next: NextFunction) => {
    const filename = req.params.filename;

    try {
        // Search for files in the database matching the filename
        const searchResults = await db.query("SELECT id, filename, description FROM files WHERE filename LIKE $1",
        [filename]);

        const files = searchResults.rows;

        if (files.length === 0) {
            // No files found matching the query
            throw new DatabaseError("No files found");
        }

        // Files found, send them as a JSON response
        return res.status(200).json({ message: "Search results", files });
    } catch (error) {
        next(error); // Pass the error to the errorHandlingMiddleware
    }
};