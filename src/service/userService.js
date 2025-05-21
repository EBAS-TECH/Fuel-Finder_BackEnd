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
export const createUserService = async (first_name,last_name,username,password,email,role,profile_pic,verified) => {
  const id =uuidv4();
  const result = await pool.query(
    "INSERT INTO users (id,first_name,last_name,username,password,email,role,profile_pic,verified) VALUES ($1, $2,$3,$4,$5,$6,$7,$8,$9) RETURNING *",
    [id,first_name,last_name,username,password,email,role,profile_pic,verified]
  );
  return result.rows[0];
};
export const updateUserService = async (id,first_name,last_name,username) => {
  const result = await pool.query(
    "UPDATE users SET first_name=$1, last_name=$2,username=$3 WHERE id=$4 RETURNING *",
    [first_name,last_name,username, id]
  );
  return result.rows[0];
};
export const updateUserWithEmailService = async (id,first_name,last_name,username,email,password) => {
  const result = await pool.query(
    "UPDATE users SET first_name=$1, last_name=$2,username=$3,email =$4,password=$5 WHERE id=$6 RETURNING *",
    [first_name,last_name,username,email,password, id]
  );
  return result.rows[0];
};
export const verifyUserByIdService = async (id) => {
  const result = await pool.query(
    "UPDATE users SET verified=$1 WHERE id=$2 RETURNING *",
    [true, id]
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

export const changeProfilePicService = async (id, profile_pic) => {
  // Update password in the database
  const updateResult = await pool.query(
    "UPDATE users SET profile_pic = $1 WHERE id = $2 RETURNING *",
    [profile_pic, id]
  );

  return updateResult.rows[0];
};
export const updateNewPasswordService = async (id,newPassword) => {
  const result = await pool.query(
    "UPDATE users SET password=$1 WHERE id=$2 RETURNING *",
    [newPassword, id]
  );
  return result.rows[0];
};

