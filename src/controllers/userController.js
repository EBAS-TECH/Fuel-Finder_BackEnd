import {
  changePasswordService,
  changeProfilePicService,
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByEmailService,
  getUserByIdService,
  getUserByUsernameService,
  updateUserService,
  updateUserWithEmailService,
} from "../service/userService.js";
import { validate as isUUID } from "uuid";
import bcrypt from "bcryptjs";
import { deleteFeedbacksByUserIdService } from "../service/feedbackService.js";
import { deleteFavoritesByUserIdService } from "../service/favoriteService.js";
import multer from 'multer';
import streamifier from 'streamifier';
import { v2 as cloudinary } from 'cloudinary';

// Standardized response function
const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

// Multer setup
const storage = multer.memoryStorage();
export const upload = multer({ storage });

export const createUser = async (req, res, next) => {
  const {
    first_name,
    last_name,
    username,
    password,
    email,
    role,
    profile_pic,
  } = req.body;

  const user = await getUserByUsernameService(username);
  if (user) {
    return res.status(400).json({ error: "Username already exists" });
  }
  const user1 = await getUserByEmailService(email);
  if (user1) {
    return res.status(400).json({ error: "email already exists" });
  }
  let verified = false;
  if (role == "MINISTRY_DELEGATE" || "ADMIN") {
    verified = true;
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const defaultProfilePic =
    profile_pic ||
    `https://avatar.iran.liara.run/public/boy?username=${username}`;
  try {
    const newUser = await createUserService(
      first_name,
      last_name,
      username,
      hashedPassword,
      email,
      role,
      defaultProfilePic,
      verified
    );
    const { password, ...userWithoutPassword } = newUser;
    handleResponse(res, 201, "User created successfully", userWithoutPassword);
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
    handleResponse(res, 500, "An error occurred while fetching All users.");
  }
};

export const getUserById = async (req, res) => {
  if (!isUUID(req.params.id)) {
    console.log(req.params.id);
    return res
      .status(400)
      .json({ error: "Invalid token payload: userId is not a valid UUID" });
  }
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return handleResponse(res, 404, "User not found");
    const { password, ...userWithoutPassword } = user;
    handleResponse(res, 200, "User fetched successfully", userWithoutPassword);
  } catch (err) {
    console.error("Error fetching user by ID:", err.message);
    handleResponse(res, 500, "An error occurred while fetching the user.");
  }
};

export const updateUserById = async (req, res, next) => {
  if (!isUUID(req.params.id)) {
    return res
      .status(400)
      .json({ error: "Invalid token payload: userId is not a valid UUID" });
  }


  try {
    const { first_name, last_name, username } = req.body;

    const user = await getUserByUsernameService(username);
    const user1 = await getUserByIdService(req.params.id);

    if (user && user1?.username != username) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const updatedUser = await updateUserService(
      req.params.id,
      first_name,
      last_name,
      username
    );
    if (!updatedUser) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User updated successfully", updatedUser);
  } catch (err) {
    next(err);
  }
};

export const updateUserWithEmailById = async (req, res, next) => {
  const user_id = req.user.id;
  try {
    const { first_name, last_name, username, email } = req.body;

    const user = await getUserByUsernameService(username);
    const user1 = await getUserByIdService(user_id);
    const user2 = await getUserByEmailService(email);

    if (user && user1?.username != username) {
      return res.status(400).json({ error: "Username already exists" });
    }
    if (user2 && user1?.email != email) {
      return res.status(400).json({ error: "email already exists" });
    }
    const updatedUser = await updateUserWithEmailService(
      user_id,
      first_name,
      last_name,
      username,
      email
    );
    if (!updatedUser) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User updated successfully", updatedUser);
  } catch (err) {
    next(err);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    await deleteFeedbacksByUserIdService(req.params.id);
    await deleteFavoritesByUserIdService(req.params.id);
    const deletedUser = await deleteUserService(req.params.id);
    if (!deletedUser) return handleResponse(res, 404, "User not found");
    handleResponse(res, 200, "User deleted successfully", deletedUser);
  } catch (err) {
    next(err);
  }
};

export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const user = await getUserByIdService(userId);
    if (!user) return handleResponse(res, 404, "User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }
    const isMatch2 = await bcrypt.compare(newPassword, user.password);
    if (!isMatch2) {
      throw new Error("new password is same with previuos password");
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



export const changeProfilePic = async (req, res) => {
  // Cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
  });

  try {
    const userId = req.user.id;

    if (!req.file) return res.status(400).json({ error: "Profile picture is required" });


    const user = await getUserByIdService(userId);
    if (!user) return handleResponse(res, 404, "User not found");

    // Upload to Cloudinary
    const uploadStream = () => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'profile_pics', public_id: `user_${userId}_${Date.now()}` },
        (err, result) => err ? reject(err) : resolve(result)
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
    // Update user profile with hosted image URL
    const result = await uploadStream();
    const updatedUser = await changeProfilePicService(userId, result.secure_url);

    res.status(200).json({
      message: "Profile picture updated successfully",
      profile_pic: updatedUser.profile_pic
    });
  } catch (error) {
    console.error("Error changing profile picture:", error.message);
    res.status(400).json({ error: error.message });
  }
};