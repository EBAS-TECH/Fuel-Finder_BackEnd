import express from "express";
import { createFeedback, deleteFeedback, getAllFeedback, getFeedbackById, getFeedbackByStationId, getFeedbackByUserId, getFeedbackByUserIdAndStationIdController, getRateNumberByUserId, updateFeedback } from "../controllers/feedbackController.js";
import protectRoute from "../middlewares/protectRoute.js";


const router = express.Router();


router.post("/", protectRoute, createFeedback);
router.get("/rate", protectRoute, getRateNumberByUserId);
router.get("/station/:station_id/user/:user_id", protectRoute, getFeedbackByUserIdAndStationIdController);
router.get("/station/:station_id", protectRoute, getFeedbackByStationId);
router.get("/user/:user_id", protectRoute, getFeedbackByUserId);
router.get("/:id", protectRoute, getFeedbackById);
router.put("/:id", protectRoute, updateFeedback);
router.delete("/:id", protectRoute, deleteFeedback);


export default router;