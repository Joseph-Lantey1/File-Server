import express from "express";
import { resetPassword, reset, resetPasswordPage, resetNewPassword } from "../controllers/passwordControllers";


const router = express.Router();


router.get("/reset", reset);


router.get("/reset-password", resetPasswordPage);
router.post("/reset-password", resetNewPassword);



export default router;