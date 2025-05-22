import express from "express";
import { createGeneralComment, getGeneralComments } from "../controllers/generalCommentController.js";

const router = express.Router();

// Create a new general comments
router.post("/",createGeneralComment);

// Get all general comments
router.get("/", getGeneralComments);

export default router;