import {
    createGeneralCommentService,
    getGeneralCommentsService,
  } from '../service/generalCommentService.js';
  
  // Controller to create a new general comment
  export const createGeneralComment = async (req, res) => {
    try {
      const { full_name, email, message } = req.body;
  
      // Basic validation
      if (!full_name || !email || !message) {
        return res.status(400).json({ message: "All fields are required: full_name, email, message" });
      }
  
      const newComment = await createGeneralCommentService(full_name, email, message);
      return res.status(201).json({ message: "Comment submitted successfully", data: newComment });
    } catch (error) {
      console.error("Error creating comment:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  
  // Controller to fetch all general comments
  export const getGeneralComments = async (req, res) => {
    try {
      const comments = await getGeneralCommentsService();
      return res.status(200).json({ data: comments });
    } catch (error) {
      console.error("Error fetching comments:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  };
  