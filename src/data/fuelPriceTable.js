import pool from "../config/db.js";

const createFuelPriceTable = async () => {
     const queryText = `
    CREATE TABLE IF NOT EXISTS fuel_prices (
    id uuid PRIMARY KEY,
    fuel_type fuel_type NOT NULL, 
    price INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP,
    CONSTRAINT unique_fuel_type UNIQUE (fuel_type)
);
      `;
      try {
        await pool.query(queryText);   
        console.log("fuel price table created if not exists");
      } catch (error) {
        console.log("Error creating fuel price table: ", error);
      }
    }

export default createFuelPriceTable;

