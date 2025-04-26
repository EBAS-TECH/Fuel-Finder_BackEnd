import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js"; // Adjust this based on your structure

// Create a new fuel availability record
export const createFuelAvailabilityService = async (station_id, fuel_type, up_time, down_time = null) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO fuel_availability (
      id, station_id, fuel_type, up_time, down_time
    ) VALUES (
      $1, $2, $3, $4, $5
    ) RETURNING id, station_id, fuel_type, up_time, down_time, availability_duration`,
    [id, station_id, fuel_type, up_time, down_time]
  );
  return result.rows[0];
};

// Get all fuel availability records
export const getAllFuelAvailabilitiesService = async () => {
  const result = await pool.query(`
    SELECT 
      id, station_id, fuel_type, up_time, down_time, availability_duration
    FROM fuel_availability
  `);
  return result.rows;
};

// Get all fuel availability records by station ID
export const getFuelAvailabilityByStationIdService = async (station_id) => {
  const result = await pool.query(
    `
    SELECT 
      id, station_id, fuel_type, up_time, down_time, availability_duration
    FROM fuel_availability
    WHERE station_id = $1
    `,
    [station_id]
  );
  return result.rows;
};

// Get fuel availability by ID
export const getFuelAvailabilityByIdService = async (id) => {
  const query = `
    SELECT 
      id, station_id, fuel_type, up_time, down_time, availability_duration
    FROM fuel_availability
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0]; // returns undefined if not found
};

// Delete fuel availability record by ID
export const deleteFuelAvailabilityByIdService = async (id) => {
  const query = `
    DELETE FROM fuel_availability 
    WHERE id = $1 
    RETURNING *
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0]; // returns undefined if the record was not found
};

// Update fuel availability record by ID
export const updateFuelAvailabilityByIdService = async (id, up_time, down_time) => {
  const query = `
    UPDATE fuel_availability
    SET 
      up_time = $1,
      down_time = $2,
      updated_at = NOW()
    WHERE id = $3
    RETURNING id, station_id, fuel_type, up_time, down_time, availability_duration
  `;
  const result = await pool.query(query, [up_time, down_time, id]);
  return result.rows[0]; // returns undefined if not found
};

// Update fuel availability status (if you want to track if the fuel is available)
export const updateFuelAvailabilityStatusByIdService = async (id, availability) => {
  const query = `
    UPDATE fuel_availability
    SET 
      availability = $1,
      updated_at = NOW()
    WHERE id = $2
    RETURNING id, station_id, fuel_type, up_time, down_time, availability_duration
  `;
  const result = await pool.query(query, [availability, id]);
  return result.rows[0]; // returns undefined if not found
};

// Get the fuel availability by station and fuel type
export const getFuelAvailabilityByStationAndFuelTypeService = async (station_id, fuel_type) => {
  const query = `
    SELECT 
      id, station_id, fuel_type, up_time, down_time, availability_duration
    FROM fuel_availability
    WHERE station_id = $1 AND fuel_type = $2
  `;
  const result = await pool.query(query, [station_id, fuel_type]);
  return result.rows;
};


