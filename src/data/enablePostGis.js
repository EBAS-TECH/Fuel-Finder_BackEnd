import pool from "../config/db.js";

const enablePostGIS = async () => {
  try {
    await pool.query(`CREATE EXTENSION IF NOT EXISTS postgis;`);
    console.log(" PostGIS extension enabled.");
  } catch (error) {
    console.error(" Error enabling PostGIS extension:", error);
  }
};

export default enablePostGIS;