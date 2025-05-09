import express from "express";
import {signup,login,logout, emailVerify, resendEmailVerification, forgotPassWord} from "../controllers/authController.js"
import { validateSignUpUser } from "../middlewares/userInputValidator.js";

const router = express.Router();

router.post("/signup",validateSignUpUser,signup);
router.post("/login",login);
router.post("/logout",logout);
router.put("/verify/:id",emailVerify);
router.get("/resend/:id",resendEmailVerification);
router.put("/forgot",forgotPassWord);


export default router