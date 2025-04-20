import {
  changePasswordService,
    createUserService,
    deleteUserService,
    getAllUsersService,
    getUserByIdService,
    updateUserService,
  } from "../models/userModel.js";
  import { validate as isUUID } from "uuid";
  import bcrypt from "bcryptjs";
  
  
  // Standardized response function
  const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
      status,
      message,
      data,
    });
  };
  
  export const createUser = async (req, res, next) => {
    const { name, email } = req.body;
    try {
      const newUser = await createUserService(
        first_name,
        last_name,
        username,
        hashedPassword,
        email,
        role,
        defaultProfilePic
    );
      handleResponse(res, 201, "User created successfully", newUser);
    } catch (err) {
      next(err);
    }
  };
  
  export const getAllUsers = async (req, res) => {
    try {
      const users = await getAllUsersService();
      handleResponse(res, 200, "Users fetched successfully", users);
    } catch (err) {
      console.error("Error fetching All user:", err.message);
      handleResponse(res,500, "An error occurred while fetching All users.");
    }
  };
  
  export const getUserById = async (req, res) => {
    if (!isUUID(req.params.id)) {
      return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
    }
    try {
      const user = await getUserByIdService(req.params.id);
      if (!user) return handleResponse(res, 404, "User not found");
      handleResponse(res, 200, "User fetched successfully", user);
    } catch (err) {
      console.error("Error fetching user by ID:", err.message);
      handleResponse(res,500, "An error occurred while fetching the user.");
    }
  };
  
  export const updateUserById = async (req, res, next) => {
    const { name, email } = req.body;
    try {
      const updatedUser = await updateUserService(req.params.id, name, email);
      if (!updatedUser) return handleResponse(res, 404, "User not found");
      handleResponse(res, 200, "User updated successfully", updatedUser);
    } catch (err) {
      next(err);
    }
  };
  
  export const deleteUserById = async (req, res, next) => {
    try {
      const deletedUser = await deleteUserService(req.params.id);
      if (!deletedUser) return handleResponse(res, 404, "User not found");
      handleResponse(res, 200, "User deleted successfully", deleteUser);
    } catch (err) {
      next(err);
    }
  };

  export const changePassword = async (req, res) => {
    try {
      const  userId  = req.user.id; 
      const { oldPassword, newPassword, confirmPassword } = req.body;

      const user = await getUserByIdService(userId);
      if (!user) return handleResponse(res, 404, "User not found");
      
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        throw new Error("Old password is incorrect");
        }
  
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ error: "New passwords do not match" });
      }
       // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
      const updatedUser = await changePasswordService(userId, hashedPassword);
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      console.error("Error changing password:", error.message);
      res.status(400).json({ error: error.message });
    }
  };
  