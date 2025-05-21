import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js";

export const createGeneralCommentService = async (full_name, email, message) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO general_comments (
      id, full_name, email, message
    ) VALUES (
      $1, $2, $3, $4
    ) RETURNING *`,
    [id, full_name, email, message]
  );
  return result.rows[0];
};

export const getGeneralCommentsService = async () => {
  const result = await pool.query(`
    SELECT * FROM general_comments
  `);

  return result.rows;
};
