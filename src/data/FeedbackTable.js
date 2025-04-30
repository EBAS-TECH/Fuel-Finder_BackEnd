import pool from "../config/db.js";

const createfeedbackTable = async () => {
     const queryText = `
    CREATE TABLE IF NOT EXISTS feedbacks (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users(id),
    station_id uuid REFERENCES stations(id),
    rating INT CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    UNIQUE (user_id, station_id) 
);

      `;
      try {
        await pool.query(queryText);   
        console.log("feedback table created if not exists");
      } catch (error) {
        console.log("Error creating feedback table: ", error);
      }
    }

export default createfeedbackTable;

