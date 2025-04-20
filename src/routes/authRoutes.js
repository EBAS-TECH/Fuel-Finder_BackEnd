import express from "express";
import {signup,login,logout} from "../controllers/authController.js"
import validateUser from "../middlewares/inputValidator.js";
const router = express.Router();

router.post("/signup",validateUser,signup);
router.post("/login",login);
router.post("/logout",logout);


export default router