import pool from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';

// Create a new feedback entry
export const createFeedbackService = async (user_id, station_id, rating, comment) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO feedbacks (id, user_id, station_id, rating, comment) 
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [id, user_id, station_id, rating, comment]
  );
  return result.rows[0];
};


// get all feedback
export const getAllFeedbackService = async () => {
    const result = await pool.query(
      `SELECT user_id, station_id, rating, comment, created_at, updated_at 
       FROM feedbacks 
       ORDER BY created_at DESC`
    );
    return result.rows;
  };
  
// Get all feedbacks by a specific user
export const getFeedbackByIdService = async (id) => {
    const result = await pool.query(
      `SELECT * FROM feedbacks WHERE id = $1 ORDER BY created_at DESC`,
      [id]
    );
    return result.rows;
  };

// Get all feedbacks for a specific station
export const getFeedbackByStationIdService = async (station_id) => {
  const result = await pool.query(
    `SELECT * FROM feedbacks WHERE station_id = $1 ORDER BY created_at DESC`,
    [station_id]
  );
  return result.rows;
};

// Get all feedbacks by a specific user
export const getFeedbackByUserIdService = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM feedbacks WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );
  return result.rows;
};
// get feedback by user_id and station_id
export const getFeedbackByUserIdAndStationIdService = async (user_id, station_id) => {
    const result = await pool.query(
      `SELECT * 
       FROM feedbacks 
       WHERE user_id = $1 AND station_id = $2 
      `,
      [user_id, station_id]
    );
    return result.rows[0];
  };

// Update a feedback entry (comment and/or rating)
export const updateFeedbackService = async (id, { rating, comment }) => {
    const result = await pool.query(
      `UPDATE feedbacks 
       SET rating = $1, comment = $2, updated_at = NOW()
       WHERE id = $3 
       RETURNING *`,
      [rating, comment, id]
    );
    return result.rows[0];
  };

// Delete a feedback entry
export const deleteFeedbackService = async (id) => {
  const result = await pool.query(
    `DELETE FROM feedbacks WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};
// get Average rank

export const getAverageRateByStationIdService = async (station_id) => {
  const result = await pool.query(
    `SELECT AVG(rating) AS average_rate FROM feedbacks WHERE station_id = $1`,
    [station_id]
  );
  return result.rows[0].average_rate;
};