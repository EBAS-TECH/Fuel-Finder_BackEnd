import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js"; // Adjust this based on your structure

// Create a new fuel availability record
export const createFuelAvailabilityService = async (station_id, fuel_type) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO fuel_availability (
      id, station_id, fuel_type, up_time
    ) VALUES (
      $1, $2, $3, NOW()
    ) RETURNING id, station_id, fuel_type, up_time, down_time, availability_duration`,
    [id, station_id, fuel_type]
  );
  return result.rows[0];
};

// Get all fuel availability records
export const getAllFuelAvailabilitiesService = async () => {
  const result = await pool.query(`
    SELECT 
  id, station_id, fuel_type, up_time, down_time, available,
  CASE 
    WHEN down_time IS NULL THEN EXTRACT(EPOCH FROM (NOW() - up_time))
    ELSE EXTRACT(EPOCH FROM availability_duration)
  END AS availability_duration
  FROM fuel_availability
  `);
  return result.rows;
};

// Get all fuel availability records by station ID
export const getFuelAvailabilityByStationIdService = async (station_id) => {
  const result = await pool.query(
    `
    SELECT 
  id, station_id, fuel_type, up_time, down_time, available,
  CASE 
    WHEN down_time IS NULL THEN EXTRACT(EPOCH FROM (NOW() - up_time))
    ELSE EXTRACT(EPOCH FROM availability_duration)
  END AS availability_duration
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
      id, station_id, fuel_type, up_time, down_time, available,
      CASE 
        WHEN down_time IS NULL THEN EXTRACT(EPOCH FROM (NOW() - up_time))
        ELSE EXTRACT(EPOCH FROM availability_duration)
      END AS availability_duration
    FROM fuel_availability
    WHERE id = $1
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0]; // returns undefined if not found
};

// Get fuel availability by fuel type and availability
export const getFuelAvailabilityByFuelTypeAndAvailabilityService = async (fuel_type, available) => {
  const query = `
    SELECT 
      id, station_id, fuel_type, up_time, down_time, available,
      CASE 
        WHEN down_time IS NULL THEN EXTRACT(EPOCH FROM (NOW() - up_time))
        ELSE EXTRACT(EPOCH FROM availability_duration)
      END AS availability_duration
    FROM fuel_availability
    WHERE fuel_type = $1 AND available = $2
  `;
  const result = await pool.query(query, [fuel_type, available]);
  return result.rows; // returns an array of matching rows
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

// Update fuel availability by ID (sets down_time and duration)
export const updateFuelAvailabilityByIdService = async (id,fuel_type) => {
  const query = `
    UPDATE fuel_availability
SET 
  down_time = NOW(),
  available = false,
  availability_duration = (NOW() - up_time)
WHERE station_id = $1 
  AND fuel_type = $2
  AND down_time IS NULL
RETURNING id, station_id, fuel_type, up_time, down_time, availability_duration, available;
  `;
  const result = await pool.query(query, [id,fuel_type]);
  return result.rows[0]; // returns undefined if not found
};

// Get the fuel availability by station and fuel type
export const getFuelAvailabilityByStationAndFuelTypeService = async (station_id, fuel_type) => {
  const query = `
    SELECT 
      id, station_id, fuel_type, up_time, down_time, available,
      CASE 
        WHEN down_time IS NULL THEN EXTRACT(EPOCH FROM (NOW() - up_time))
        ELSE EXTRACT(EPOCH FROM availability_duration)
      END AS availability_duration
    FROM fuel_availability
    WHERE station_id = $1 AND fuel_type = $2
  `;
  const result = await pool.query(query, [station_id, fuel_type]);
  return result.rows;
};

// Get the  the most recent record or undefined
export const getLastFuelAvailabilityByStationAndFuelTypeService = async (station_id, fuel_type) => {
  const query = `
  SELECT *
  FROM fuel_availability
  WHERE station_id = $1 AND fuel_type = $2
  ORDER BY up_time DESC
  LIMIT 1
`;
const result = await pool.query(query, [station_id, fuel_type]);
return result.rows[0];
};

export const getAvailableFuelTypeByStationIdService = async (station_id) => {
  const result = await pool.query(
    `
    SELECT fuel_type
    FROM fuel_availability
    WHERE station_id = $1 AND available = true
    `,
    [station_id]
  );

  return result.rows.map(row => row.fuel_type);
};
