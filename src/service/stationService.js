import { v4 as uuidv4 } from "uuid";
import pool from "../config/db.js"; // Adjust this based on your structure

export const createStationService = async (en_name, am_name,tin_number, user_id, latitude, longitude, address,logo) => {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO stations (
        id, en_name, am_name,tin_number,user_id, location, address,logo
      ) VALUES (
        $1, $2, $3, $4,$5, ST_SetSRID(ST_MakePoint($6, $7), 4326), $8,$9
      ) RETURNING id, en_name, am_name,tin_number, user_id, ST_X(location) AS longitude, ST_Y(location) AS latitude, address, availability,status,logo, created_at, updated_at`,
      [id, en_name, am_name, tin_number,user_id, longitude, latitude, address,logo]
    );
    return result.rows[0];
  };
  
export const getAllStationsService = async () => {
    const result = await pool.query(`
      SELECT 
        id,en_name,am_name,tin_number,user_id,address,availability,status,logo,created_at,updated_at,
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
        id, en_name, am_name, tin_number, user_id, address, availability, status,logo, created_at, updated_at,
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
        id,en_name,am_name,tin_number,user_id,address,availability,status,logo,created_at,updated_at,
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
        id,en_name,am_name,tin_number,user_id,address,availability,status,logo,created_at,updated_at,
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


  export const updateStationByIdService = async (
    id,
    en_name,
    am_name,
    tin_number,
    user_id,
    latitude,
    longitude,
    address
  ) => {
    const result = await pool.query(
      `UPDATE stations
       SET en_name = $1,
           am_name = $2,
           tin_number = $3,
           user_id = $4,
           location = ST_SetSRID(ST_MakePoint($5, $6), 4326),
           address = $7,
           updated_at = NOW()
       WHERE id = $8
       RETURNING id, en_name, am_name, tin_number, user_id, ST_X(location) AS longitude, ST_Y(location) AS latitude, address, availability, status, created_at, updated_at`,
      [en_name, am_name, tin_number, user_id, longitude, latitude, address, id]
    );
  
    return result.rows[0];
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

  export const getNearbyStationsService = async (latitude, longitude, radius = 10000, limit) => {
    const query = `
      SELECT id, en_name, am_name, address,
             ST_Distance(location::geography, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography) AS distance,
             ST_X(location) AS longitude, ST_Y(location) AS latitude, logo
      FROM stations
      WHERE status = 'VERIFIED'
        AND ST_DWithin(location::geography, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography, $3)
      ORDER BY distance
      LIMIT $4
    `;
  
    const result = await pool.query(query, [latitude, longitude, radius, limit]);
    return result.rows;
  };
  
  
  
  
  export const getListStationIdService = async () => {
    const result = await pool.query(
      `SELECT id FROM stations where status = 'VERIFIED' ORDER BY created_at DESC`
    );
    return result.rows.map(row => row.id);
  };
  export const changeStationLogoService = async (id, logo) => {
    // Update station logo in the database
    const updateResult = await pool.query(
      "UPDATE stations SET logo = $1 WHERE id = $2 RETURNING *",
      [logo, id]
    );
  
    return updateResult.rows[0];
  };