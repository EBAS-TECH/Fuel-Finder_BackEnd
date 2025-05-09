import pool from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';

export const createEmailVerificationService = async (user_id,token,{ verification_expires_at }) => {
    const id =uuidv4();
    const result = await pool.query(
      "INSERT INTO email_verifications (id,user_id,token,verification_expires_at) VALUES ($1, $2,$3,$4) RETURNING *",
      [id,user_id,token,verification_expires_at]
    );
    return result.rows[0];
  };

  export const getEmailVerificationByIdService = async (id) => {
    const result = await pool.query("SELECT * FROM email_verifications where user_id = $1", [id]);
    return result.rows[0];
  };

  export const updateEmailVerificationByUserIdService = async (user_id) => {
    const result = await pool.query(
      "UPDATE email_verifications SET verified=$1 WHERE user_id=$2 RETURNING *",
      [true,user_id]
    );
    return result.rows[0];
  };
  export const deleteEmailVerificationByUserIdService = async (user_id,verified) => {
    const result = await pool.query(
      "DELETE users SET verified=$1, WHERE user_id=$2 RETURNING *",
      [verified,user_id]
    );
    return result.rows[0];
  };
  export const resendEmailVerificationByUserIdService = async (user_id, token, { verification_expires_at }) => {
    const result = await pool.query(
      `UPDATE email_verifications 
       SET token = $1, verification_expires_at = $2 
       WHERE user_id = $3 
       RETURNING *`,
      [token, verification_expires_at, user_id]
    );
    
    return result.rows[0];
  };

  export const forgotPasswordByEmailService = async (user_id, token, { verification_expires_at }) => {
    const result = await pool.query(
      `UPDATE email_verifications 
       SET token = $1, verification_expires_at = $2 
       WHERE user_id = $3 
       RETURNING *`,
      [token, verification_expires_at, user_id]
    );
    
    return result.rows[0];
  };
  