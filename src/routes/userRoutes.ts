// userRoutes.ts

import express from "express";
import { userLogin, userSignup, signup } from "../controllers/userControllers";
import UserRegisterValidationMiddleware from "../middlewares/registerValidatioMiddleware";

const router = express.Router();


router.post("/login", userLogin);

router.post("/signup", UserRegisterValidationMiddleware.validate(), userSignup);
router.get("/signup", signup);

export default router;
