import {
  changePasswordService,
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  getUserByUsernameService,
  updateUserService,
} from "../service/userService.js";
import { validate as isUUID } from "uuid";
import bcrypt from "bcryptjs";
import { deleteFeedbacksByUserIdService } from "../service/feedbackService.js";
import { deleteFavoritesByUserIdService } from "../service/favoriteService.js";

// Standardized response function
const handleResponse = (res, status, message, data = null) => {
  res.status(status).json({
    status,
    message,
    data,
  });
};

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
      defaultProfilePic
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

  const { first_name, last_name, username, profile_pic } = req.body;

  const user = await getUserByUsernameService(username);
  const user1 = await getUserByIdService(req.params.id);

  if (user && user1?.username != username) {
    return res.status(400).json({ error: "Username already exists" });
  }
  try {
    const defaultProfilePic =
      profile_pic ||
      `https://avatar.iran.liara.run/public/boy?username=${username}`;

    const updatedUser = await updateUserService(
      req.params.id,
      first_name,
      last_name,
      username,
      defaultProfilePic
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

