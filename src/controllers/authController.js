import  { createUserService, getUserByEmailService, getUserByUsernameService } from "../models/userModel.js";
import generateTokenAndsetCookie from "../utils/generateTokens.js";
import bcrypt from "bcryptjs";

// Standardized response function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
      status,
      message,
      data,
    });
  };

  export const signup = async (req, res, next) => {
    try {
        const { first_name, last_name, username, password, confirmPassword, email, role, profile_pic } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match" });
        }

        const user = await getUserByUsernameService(username);
        if (user) {
            return res.status(400).json({ error: "Username already exists" });
        }
        const user1 = await getUserByEmailService(email);
        if (user1) {
            return res.status(400).json({ error: "email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const defaultProfilePic = profile_pic || `https://avatar.iran.liara.run/public/boy?username=${username}`;

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

            generateTokenAndsetCookie(newUser.id, res);
            const { password, ...userWithoutPassword } = newUser;
            handleResponse(res, 201, "User created successfully", userWithoutPassword);

        } catch (err) {
            next(err);
        }

    } catch (error) {
        console.log("Error in signup controller:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const  username = req.body.username;

        // Get user from DB using the custom service
        const user = await getUserByUsernameService(username);

        // Check if user exists and password is correct
        const isPasswordCorrect = await bcrypt.compare(req.body.password, user?.password || "");

        if (!user || !isPasswordCorrect) {
            return res.status(400).json({ error: "Username or password not correct" });
        }

        // Set JWT cookie
        generateTokenAndsetCookie(user.id, res);

        // Respond with user data (update field names based on your table)
        const { password, ...userWithoutPassword } = user;
        handleResponse(res, 200, "User login successfully", userWithoutPassword);

    } catch (error) {
        console.error("Error in login controller:", error.message);
        res.status(500).json({ error: error.message });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
        console.log("error in login controller", error.message)
        res.status(500).json({ error: error.message })  
    }
}


  