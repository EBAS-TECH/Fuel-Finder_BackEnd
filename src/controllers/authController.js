import { sendVerificationEmail, sendWelcomeEmail } from "../utils/emailNotification/emails.js";
import { createEmailVerificationService, getEmailVerificationByIdService, updateEmailVerificationByUserIdService } from "../models/emailVerificationModel.js";
import  { createUserService, deleteUserService, getUserByEmailService, getUserByIdService, getUserByUsernameService, verifyUserByIdService } from "../models/userModel.js";
import generateTokenAndsetCookie from "../utils/generateTokens.js";
import bcrypt from "bcryptjs";
import { validate as isUUID } from "uuid";


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
        const { first_name, last_name, username, password, email, role, profile_pic } = req.body;

        const user = await getUserByUsernameService(username);
        if (user && user?.verified) {
            return res.status(400).json({ error: "Username already exists" });
        }
        else{
            await deleteUserService(user?.id);
        }
        const user1 = await getUserByEmailService(email);
        if (user1 && user1?.verified) {
            return res.status(400).json({ error: "email already exists" });
        }else{
            await deleteUserService(user1?.id);
        }


        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const defaultProfilePic = profile_pic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const verificationToken = Math.floor(100000+Math.random()*900000).toString();
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
            const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
            const newEmailVerification = await createEmailVerificationService(
                newUser.id,
                verificationToken,
                {
                    verification_expires_at: expiresAt,
                }
            );
            

            // generateTokenAndsetCookie(newUser.id, res);
            await sendVerificationEmail(newUser.email,verificationToken);
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

        if (!user || !isPasswordCorrect || !user?.verified) {
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

export const emailVerify = async (req, res) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
      }
    try {
        const user_id = req.params.id
        const token = req.body.token
        const user = await getUserByIdService(req.params.id);
        if (!user) return handleResponse(res, 404, "User not found By thid Id");

        const emailVerification = await getEmailVerificationByIdService(user_id);
        if (!emailVerification) return handleResponse(res, 404, "Email Verification not found");

        if (emailVerification?.verified) {
            return res.status(400).json({ message: "Email is already verified." });
        }
        
        if (emailVerification?.verification_expires_at > new Date()) {
            if(emailVerification?.token == token){
            await verifyUserByIdService(user_id);
            const emailVerification = await updateEmailVerificationByUserIdService(user_id);
            generateTokenAndsetCookie(user_id, res);
            await sendWelcomeEmail(user?.email,user?.username);
            return handleResponse(res,200, "Email verified successfully",emailVerification);}{
                return res.status(400).json({ message: "Verification token not correct." });
            }
        } else {
            return res.status(400).json({ message: "Verification token has expired." });
        }


    } catch (error) {
        console.error("Error in email verify controller:", error.message);
        res.status(500).json({ error: error.message });
    }
};




  