import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js"; // Adjust this based on your structure

export const createStationService = async (en_name, am_name,tin_number, user_id, latitude, longitude, address) => {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO stations (
        id, en_name, am_name,tin_number,user_id, location, address
      ) VALUES (
        $1, $2, $3, $4,$5, ST_SetSRID(ST_MakePoint($6, $7), 4326), $8
      ) RETURNING id, en_name, am_name,tin_number, user_id, ST_X(location) AS longitude, ST_Y(location) AS latitude, address, availability,status, created_at, updated_at`,
      [id, en_name, am_name, tin_number,user_id, longitude, latitude, address]
    );
    return result.rows[0];
  };
  
export const getAllStationsService = async () => {
    const result = await pool.query(`
      SELECT 
        id,en_name,am_name,tin_number,user_id,address,availability,status,created_at,updated_at,
        ST_Y(location::geometry) AS latitude,
        ST_X(location::geometry) AS longitude
      FROM stations
    `);
  
    return result.rows;
  };
  export const getAllStationsByStatusService = async (status) => {
    const result = await pool.query(
      `
      SELECT 
        id, en_name, am_name, tin_number, user_id, address, availability, status, created_at, updated_at,
        ST_Y(location::geometry) AS latitude,
        ST_X(location::geometry) AS longitude
      FROM stations
      WHERE status = $1
      `,
      [status]
    );
  
    return result.rows;
  };
  

export const getStationByIdService = async (id) => {
    const query = `
      SELECT 
        id,en_name,am_name,tin_number,user_id,address,availability,status,created_at,updated_at,
        ST_Y(location::geometry) AS latitude,
        ST_X(location::geometry) AS longitude
      FROM stations
      WHERE id = $1
    `;
  
    const result = await pool.query(query, [id]);
    return result.rows[0]; // returns undefined if not found
  };

  export const getStationByUserIdService = async (user_id) => {
    const query = `
      SELECT 
        id,en_name,am_name,tin_number,user_id,address,availability,status,created_at,updated_at,
        ST_Y(location::geometry) AS latitude,
        ST_X(location::geometry) AS longitude
      FROM stations
      WHERE user_id = $1
    `;
  
    const result = await pool.query(query, [user_id]);
    return result.rows[0]; // returns undefined if not found
  };

export const deleteStationByIdService = async (id) => {
    const query = `
      DELETE FROM stations 
      WHERE id = $1 
      RETURNING *
    `;
  
    const result = await pool.query(query, [id]);
    return result.rows[0]; // returns undefined if the station was not found
  };


  export const verifyStationByIdService = async (id, status) => {
    const query = `
      UPDATE stations
      SET status = $2,
          updated_at = NOW()
      WHERE id = $1
      RETURNING *
    `;
  
    const result = await pool.query(query, [id, status]);
    return result.rows[0]; // returns undefined if station with the given ID doesn't exist
  };


  export const updateStationByIdService = async (id, en_name, am_name, address) => {
    const query = `
      UPDATE stations
      SET 
        en_name = $1,
        am_name = $2,
        address = $3,
        updated_at = NOW()
      WHERE id = $4
      RETURNING *
    `;
  
    const result = await pool.query(query, [en_name, am_name, address, id]);
    return result.rows[0]; // returns the updated station, or undefined if not found
  };

  export const changeAvailabilityStationByIdService = async (id, bool) => {
    const query = `
      UPDATE stations
      SET availability = $1,
          updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `;
  
    const result = await pool.query(query, [bool, id]);
    return result.rows[0]; // returns undefined if station with the given ID doesn't exist
  };

  export const getNearbyStationsService = async (latitude, longitude, radius = 10000, limit = 3) => {
    const query = `
      SELECT id, en_name, am_name, address,
             ST_Distance(location, ST_SetSRID(ST_MakePoint($1, $2), 4326)) AS distance,
             ST_X(location) AS longitude, ST_Y(location) AS latitude
      FROM stations
      WHERE ST_DWithin(location, ST_SetSRID(ST_MakePoint($1, $2), 4326), $3)
      ORDER BY distance
      LIMIT $4
    `;
    const result = await pool.query(query, [longitude, latitude, radius, limit]);
    return result.rows;
  };
