// userRoutes.ts

import express from "express";
import { userLogin, userSignup, signup, login } from "../controllers/userControllers";
import UserRegisterValidationMiddleware from "../middlewares/registerValidatioMiddleware";

const router = express.Router();


router.post("/login", userLogin);
router.get("/login", login);
router.post("/signup", UserRegisterValidationMiddleware.validate(), userSignup);
router.get("/signup", signup);


export default router;
