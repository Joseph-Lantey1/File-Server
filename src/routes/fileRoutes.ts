import express from "express";
import { deleteFile, getUploadedFiles, searchFile, upload, uploadFile } from "../controllers/fileControllers";
import { protect } from "../controllers/authController";



const router =  express.Router();


router.post("/upload", upload.single("file"), uploadFile);
router.get("/getUploadedFiles", getUploadedFiles);
router.delete("/deleteFile/:filename", deleteFile);
router.get("/search/:filename", searchFile);



export default router;