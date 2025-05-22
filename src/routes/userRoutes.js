import express from "express";

import { changePassword, changeProfilePic, createUser, deleteUserById, getAllUsers, getUserById, updateUserById, updateUserWithEmailById } from '../controllers/userController.js';
import { validateCreateUser, validateUpdateUser } from "../middlewares/userInputValidator.js";
import protectRoute from "../middlewares/protectRoute.js";
import { upload } from "../middlewares/upload.js";



const router = express.Router();

// Get all users
router.get('/',protectRoute,getAllUsers);

// Get user by ID
router.get('/:id',protectRoute,getUserById);

// Create a new user
router.post('/',validateCreateUser,protectRoute,createUser);

// Update a user by ID
router.put('/:id',validateUpdateUser,protectRoute,updateUserById);

// Update a user by ID with email
router.put('/',validateUpdateUser,protectRoute,updateUserWithEmailById);

// Delete a user by ID
router.delete('/:id',protectRoute,deleteUserById);

router.put("/profile/change-password", protectRoute, changePassword); 

router.post("/profile/change-profile-pic",protectRoute,upload.single('profile_pic'),changeProfilePic)

export default router;

