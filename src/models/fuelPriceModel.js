import pool from "../config/db.js";
import { v4 as uuidv4 } from "uuid";


export const createOrUpdateFuelPriceService = async (fuel_type, price) => {
    const id = uuidv4();
    const result = await pool.query(
      `INSERT INTO fuel_prices (id, fuel_type, price)
       VALUES ($1, $2, $3)
       ON CONFLICT (fuel_type) DO UPDATE 
       SET price = EXCLUDED.price, updated_at = NOW()
       RETURNING *`,
      [id, fuel_type, price]
    );
    return result.rows[0];
  };

  
  export const getAllFuelPricesService = async () => {
    const result = await pool.query(`SELECT * FROM fuel_prices ORDER BY created_at DESC`);
    return result.rows;
  };

  
  export const getFuelPriceByTypeService = async (fuel_type) => {
    const result = await pool.query(`SELECT * FROM fuel_prices WHERE fuel_type = $1`, [fuel_type]);
    return result.rows[0];
  };

  
  export const updateFuelPriceService = async (fuel_type, price) => {
    const result = await pool.query(
      `UPDATE fuel_prices 
       SET price = $1, updated_at = NOW()
       WHERE fuel_type = $2
       RETURNING *`,
      [price, fuel_type]
    );
    return result.rows[0];
  };

  
  export const deleteFuelPriceByTypeService = async (fuel_type) => {
    const result = await pool.query(
      `DELETE FROM fuel_prices WHERE fuel_type = $1 RETURNING *`,
      [fuel_type]
    );
    return result.rows[0];
  };
  