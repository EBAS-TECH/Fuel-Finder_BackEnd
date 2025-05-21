import pool from "../config/db.js";

const createGeneralCommentTable = async () => {
     const queryText = `
    CREATE TABLE IF NOT EXISTS general_comments (
    id uuid PRIMARY KEY,
    full_name VARCHAR(255),
    email VARCHAR(255),
    message VARCHAR(1000),
    created_at TIMESTAMP DEFAULT NOW()
);

      `;
      try {
        await pool.query(queryText);   
        console.log("General Comments table created if not exists");
      } catch (error) {
        console.log("Error creating favorites table: ", error);
      }
    }

export default createGeneralCommentTable;

