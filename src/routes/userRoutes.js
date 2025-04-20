import express from "express";

import { changePassword, createUser, deleteUserById, getAllUsers, getUserById, updateUserById } from '../controllers/userController.js';
import validateUser from "../middlewares/inputValidator.js";
import protectRoute from "../middlewares/protectRoute.js";



const router = express.Router();

// Get all users
router.get('/',protectRoute,getAllUsers);

// Get user by ID
router.get('/:id',protectRoute,getUserById);

// Create a new user
router.post('/',validateUser,protectRoute,createUser);

// Update a user by ID
router.put('/:id',validateUser,protectRoute,updateUserById);

// Delete a user by ID
router.delete('/:id',protectRoute,deleteUserById);

router.put("/profile/change-password", protectRoute, changePassword); 

export default router;

