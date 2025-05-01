import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";

// Create a favorite
export const createFavoriteService = async (user_id, station_id) => {
  const id = uuidv4();
  const result = await pool.query(
    `INSERT INTO favorites (id, user_id, station_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [id, user_id, station_id]
  );
  return result.rows[0];
};

// Get all favorites
export const getAllFavoritesService = async () => {
  const result = await pool.query(`SELECT * FROM favorites ORDER BY created_at DESC`);
  return result.rows;
};

// Get favorites by user_id
export const getFavoritesByUserIdService = async (user_id) => {
  const result = await pool.query(
    `SELECT * FROM favorites WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );
  return result.rows;
};

// Get a single favorite by user_id and station_id
export const getFavoriteByUserIdAndStationIdService = async (user_id, station_id) => {
  const result = await pool.query(
    `SELECT * FROM favorites WHERE user_id = $1 AND station_id = $2`,
    [user_id, station_id]
  );
  return result.rows[0];
};

// Delete favorite by id
export const deleteFavoriteByIdService = async (id) => {
  const result = await pool.query(
    `DELETE FROM favorites WHERE id = $1 RETURNING *`,
    [id]
  );
  return result.rows[0];
};

// Delete favorite by user_id and station_id
export const deleteFavoriteByUserIdAndStationIdService = async (user_id, station_id) => {
  const result = await pool.query(
    `DELETE FROM favorites WHERE user_id = $1 AND station_id = $2 RETURNING *`,
    [user_id, station_id]
  );
  return result.rows[0];
};

export const getListFavoritesByUserIdService = async (user_id) => {
  const result = await pool.query(
    `SELECT station_id FROM favorites WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );
  return result.rows.map(row => row.station_id);
};
