import pool from "../config/db.js";
import { v4 as uuidv4 } from 'uuid';

export const getAllUsersService = async () => {
  const result = await pool.query("SELECT * FROM users");
  return result.rows;
};
export const getUserByIdService = async (id) => {
  const result = await pool.query("SELECT * FROM users where id = $1", [id]);
  return result.rows[0];
};
export const createUserService = async (first_name,last_name,username,password,email,role,profile_pic) => {
  const id =uuidv4();
  const result = await pool.query(
    "INSERT INTO users (id,first_name,last_name,username,password,email,role,profile_pic) VALUES ($1, $2,$3,$4,$5,$6,$7,$8) RETURNING *",
    [id,first_name,last_name,username,password,email,role,profile_pic]
  );
  return result.rows[0];
};
export const updateUserService = async (id,first_name,last_name,username,email,role,profile_pic) => {
  const result = await pool.query(
    "UPDATE users SET first_name=$1, last_name=$2,username=$3,email =$4,role =$5,profile_pic =$6 WHERE id=$7 RETURNING *",
    [first_name,last_name,username,email,role,profile_pic, id]
  );
  return result.rows[0];
};
export const deleteUserService = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
};


export const getUserByUsernameService = async (username) => {
  const result = await pool.query("SELECT * FROM users where username = $1", [username]);
  return result.rows[0];
};

export const getUserByEmailService = async (email) => {
  const result = await pool.query("SELECT * FROM users where email = $1", [email]);
  return result.rows[0];
};


export const changePasswordService = async (id, hashedPassword) => {
  // Update password in the database
  const updateResult = await pool.query(
    "UPDATE users SET password = $1 WHERE id = $2 RETURNING *",
    [hashedPassword, id]
  );

  return updateResult.rows[0];
};



