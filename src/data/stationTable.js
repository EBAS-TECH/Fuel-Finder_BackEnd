import pool from "../config/db.js";

const createStationTable = async () => {
  const enumQuery = `
      DO $$ 
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'station_status') THEN
              CREATE TYPE station_status AS ENUM ('PENDING', 'VERIFIED', 'NOT-VERIFIED');
          END IF;
      END$$;
    `;
    const queryText = `
    CREATE TABLE IF NOT EXISTS stations (
      id UUID PRIMARY KEY,
      en_name VARCHAR(100) NOT NULL,
      am_name VARCHAR(100),
      tin_number VARCHAR(10) NOT NULL,
      user_id UUID REFERENCES users(id),  -- This creates the foreign key reference to the users table
      location GEOMETRY(Point, 4326),
      address VARCHAR(255),
      availability BOOLEAN DEFAULT FALSE,
      status station_status DEFAULT 'PENDING',
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP
);
     `;
     try {
      await pool.query(enumQuery);
       await pool.query(queryText);   
       console.log("Station table created if not exists");
     } catch (error) {
       console.log("Error creating station table: ", error);
     }
   }

export default createStationTable;