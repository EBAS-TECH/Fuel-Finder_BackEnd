import express from "express";
import { createFeedback, deleteFeedback, getAllFeedback, getFeedbackById, getFeedbackByStationId, getFeedbackByUserId, getFeedbackByUserIdAndStationIdController, updateFeedback } from "../controllers/feedbackController.js";
import protectRoute from "../middlewares/protectRoute.js";


const router = express.Router();


router.post("/",protectRoute,createFeedback);
router.get("/",protectRoute,getAllFeedback)
router.get("/:id",protectRoute,getFeedbackById);
router.get("/station/:station_id",protectRoute,getFeedbackByStationId);
router.get("/user/:user_id",protectRoute,getFeedbackByUserId);
router.get("/station/:station_id/user/:user_id",protectRoute,getFeedbackByUserIdAndStationIdController)
router.put("/:id",protectRoute,updateFeedback);
router.delete("/:id",protectRoute,deleteFeedback);

export default router;