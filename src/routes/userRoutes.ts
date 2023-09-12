import { Router } from "express";
import { userLogin, userSignup } from "../controllers/userControllers";
import UserRegisterValidationMiddleware from "../middlewares/registerValidatioMiddleware";

const router = Router();

router.post("/signup", UserRegisterValidationMiddleware.validate(), userSignup);
router.get("/login", userLogin);

export default router;
