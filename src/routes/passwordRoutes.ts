import { Router } from "express";
import { changePassword, resetPassword } from "../controllers/passwordControllers";


const router = Router();

router.post("/changePassword", changePassword);
router.post("/resetPassword", resetPassword);

export default Router;