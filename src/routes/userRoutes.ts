import express from "express";
import { userLogin, userSignup, signup, login, renderUserDashboard, renderAdminDashboard } from "../controllers/userControllers";
import UserRegisterValidationMiddleware from "../middlewares/registerValidatioMiddleware";
import { protect } from "../controllers/authController";

const router = express.Router();

router.post("/signup", UserRegisterValidationMiddleware.validate(), userSignup);
router.get("/signup", signup);

router.post("/login", userLogin);
router.get("/login", login);

router.get("/userDashboard", protect, renderUserDashboard);
router.get("/adminDashboard", protect,  renderAdminDashboard);


export default router;
