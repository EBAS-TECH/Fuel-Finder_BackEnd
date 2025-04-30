import pool from "../config/db.js";

const createfavoriteTable = async () => {
     const queryText = `
    CREATE TABLE IF NOT EXISTS favorites (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users(id),
    station_id uuid REFERENCES stations(id),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE (user_id, station_id) 
);

      `;
      try {
        await pool.query(queryText);   
        console.log("favorites table created if not exists");
      } catch (error) {
        console.log("Error creating favorites table: ", error);
      }
    }

export default createfavoriteTable;

