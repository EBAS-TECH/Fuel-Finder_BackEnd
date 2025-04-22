import express from "express";
import {signup,login,logout, emailVerify} from "../controllers/authController.js"
import { validateSignUpUser } from "../middlewares/inputValidator.js";

const router = express.Router();

router.post("/signup",validateSignUpUser,signup);
router.post("/login",login);
router.post("/logout",logout);
router.put("/verify/:id",emailVerify);


export default router