import express from "express";
import { resetPassword, reset } from "../controllers/passwordControllers";


const router = express.Router();


router.get("/reset", reset);
router.post("/resetPassword", resetPassword);

router.post("/resetPassword", resetPassword);
router.post("/resetPassword", resetPassword);

export default router;