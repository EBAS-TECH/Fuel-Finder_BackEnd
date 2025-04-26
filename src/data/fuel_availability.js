import pool from "../config/db.js";

const createFuelAvailabilityTable = async () => {
  const enumQuery = `
    DO $$ 
    BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'fuel_type') THEN
            CREATE TYPE fuel_type AS ENUM ('DIESEL', 'PETROL');
        END IF;
    END $$;
  `;

  const queryText = `
  CREATE TABLE IF NOT EXISTS fuel_availability (
    id UUID PRIMARY KEY,
    station_id UUID NOT NULL REFERENCES stations(id),
    fuel_type fuel_type NOT NULL, 
    up_time TIMESTAMP DEFAULT NOW(),
    down_time TIMESTAMP,
    availability_duration INTERVAL
  );
`;

  try {
    await pool.query(enumQuery); 
    await pool.query(queryText); 
    console.log("fuel_availability table created if not exists");
  } catch (error) {
    console.log("Error creating fuel_availability table: ", error);
  }
};

export default createFuelAvailabilityTable;
