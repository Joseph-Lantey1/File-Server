import express from "express";
import { changePassword, resetPassword } from "../controllers/passwordControllers";


const router = express.Router();

router.post("/changePassword", changePassword);
router.post("/resetPassword", resetPassword);

export default router;