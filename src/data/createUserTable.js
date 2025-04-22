import pool from "../config/db.js";

const createUserTable = async () => {
    const enumQuery = `
      DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
              CREATE TYPE user_role AS ENUM ('DRIVER', 'GAS_STATION', 'ADMIN');
          END IF;
      END$$;
    `;
  
    const queryText = `
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100),
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role user_role NOT NULL,
        profile_pic VARCHAR(500),
        verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP
      );
    `;
  
    try {
      await pool.query(enumQuery);   // Ensure enum type is created
      await pool.query(queryText);   // Create the users table
      console.log("User table created if not exists");
    } catch (error) {
      console.log("Error creating users table: ", error);
    }
  };
  

export default createUserTable;