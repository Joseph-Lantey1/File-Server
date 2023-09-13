import express from "express";
import { userLogin, userSignup } from "../controllers/userControllers";
import UserRegisterValidationMiddleware from "../middlewares/registerValidatioMiddleware";

const router = express.Router();

router.post("/signup", UserRegisterValidationMiddleware.validate(), userSignup);
router.get("/login", userLogin);

export default router;
