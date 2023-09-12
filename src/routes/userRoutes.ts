import { Router } from "express";
import { userSignup } from "../controllers/userControllers";
import UserRegisterValidationMiddleware from "../middlewares/registerValidatioMiddleware";

const router = Router();

router.post("/signup", UserRegisterValidationMiddleware.validate(), userSignup);

export default router; // Export the router instance
