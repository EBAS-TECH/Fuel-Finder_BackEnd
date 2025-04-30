import {
    createFeedbackService,
    getFeedbackByStationIdService,
    getFeedbackByUserIdService,
    updateFeedbackService,
    deleteFeedbackService,
    getFeedbackByIdService,
    getAllFeedbackService,
    getFeedbackByUserIdAndStationIdService
  } from "../models/feedbackModel.js";
import { validate as isUUID } from "uuid";
  
  // Create new feedback
  export const createFeedback = async (req, res) => {
    try {
      const { station_id, rating, comment } = req.body;
      const user_id = req.user.id; // assuming user info is attached to req.user after auth

      console.log(user_id)
  
      if (!isUUID(user_id) || !isUUID(station_id)) {
        return res.status(400).json({ error: "Invalid UUID for user_id or station_id" });
      }
  
      const oldFeedback = await getFeedbackByUserIdAndStationIdService(user_id, station_id);
      if (oldFeedback) {
        const updated = await updateFeedbackService(oldFeedback.id, { rating, comment });
        if (!updated) {
          return res.status(404).json({ success: false, message: "Feedback not found" });
        }
        return res.status(200).json({ success: true, data: updated }); // <- Add return here
      }
  
      const feedback = await createFeedbackService(user_id, station_id, rating, comment);
      return res.status(201).json({ success: true, data: feedback });
  
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to create feedback",
        error: error.message || error,
      });
    }
  };
  // Get feedbacks  by id
  export const getAllFeedback = async (req, res) => {
    try {
      const feedbacks = await getAllFeedbackService();
      res.status(200).json({ success: true, message: "feedbacks retrieved successfully", data: feedbacks });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch feedback", error });
    }
  };
   // Get feedbacks  by id
   export const getFeedbackById = async (req, res) => {
    try {
      const { id } = req.params;
      const feedbacks = await getFeedbackByIdService(id);
      res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch feedback", error });
    }
  };
  
  // Get feedbacks for a station
  export const getFeedbackByStationId = async (req, res) => {
    try {
      const { station_id } = req.params;
      const feedbacks = await getFeedbackByStationIdService(station_id);
      res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch feedback", error });
    }
  };
  
  // Get feedbacks by a user
  export const getFeedbackByUserId= async (req, res) => {
    try {
      const user_id = req.params.user_id;
      const feedbacks = await getFeedbackByUserIdService(user_id);
      res.status(200).json({ success: true, data: feedbacks });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch feedback", error });
    }
  };
  
  // Update feedback
  export const updateFeedback = async (req, res) => {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;
      const updated = await updateFeedbackService(id, { rating, comment });
      if (!updated) {
        return res.status(404).json({ success: false, message: "Feedback not found" });
      }
      res.status(200).json({ success: true, data: updated });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to update feedback", error });
    }
  };
  
  // Delete feedback
  export const deleteFeedback = async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await deleteFeedbackService(id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Feedback not found" });
      }
      res.status(200).json({ success: true, message: "Feedback deleted", data: deleted });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete feedback", error });
    }
  };
// getUser by station id and user id
  export const getFeedbackByUserIdAndStationIdController = async (req, res) => {
    try {
      const { user_id, station_id } = req.params;
  
      if (!user_id || !station_id) {
        return res.status(400).json({
          success: false,
          message: "user_id and station_id are required",
        });
      }
  
      const feedback = await getFeedbackByUserIdAndStationIdService(user_id, station_id);
  
      if (!feedback) {
        return res.status(404).json({
          success: false,
          message: "Feedback not found for the specified user and station",
        });
      }
  
      return res.status(200).json({
        success: true,
        data: feedback,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Failed to retrieve feedback",
        error: error.message,
      });
    }
  };
  