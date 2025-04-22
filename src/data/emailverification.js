import pool from "../config/db.js";

const createEmailVerificationTable = async () => {
     const queryText = `
    CREATE TABLE IF NOT EXISTS email_verifications (
        id UUID PRIMARY KEY,
        user_id UUID,
        token VARCHAR(6),
        verification_expires_at TIMESTAMP,
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW()
      );
      `;
      try {
        await pool.query(queryText);   
        console.log("Email verification table created if not exists");
      } catch (error) {
        console.log("Error creating email verification table: ", error);
      }
    }

    export default createEmailVerificationTable;