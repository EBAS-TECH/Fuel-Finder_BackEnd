import { sendForgotPasswordEmail, sendVerificationEmail, sendWelcomeEmail } from "../utils/emailNotification/emails.js";
import { createEmailVerificationService, forgotPasswordByEmailService, getEmailVerificationByIdService, resendEmailVerificationByUserIdService, updateEmailVerificationByUserIdService } from "../service/emailVerificationService.js";
import  { createUserService, deleteUserService, getUserByEmailService, getUserByIdService, getUserByUsernameService, updateNewPasswordService, verifyUserByIdService } from "../service/userService.js";
import bcrypt from "bcryptjs";
import { validate as isUUID } from "uuid";
import generateToken from "../utils/generateTokens.js";
import { getUserById } from "./userController.js";
import { getStationByUserIdService } from "../service/stationService.js";


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
        const token = generateToken(user.id);

        // Respond with user data (update field names based on your table)
        const { password, ...userWithoutPassword } = user;
        if(user.role === 'GAS_STATION'){
          const station = await getStationByUserIdService(user.id);
          if(station?.status == "VERIFIED"){
            userWithoutPassword.station_approved = true;
          }
          else userWithoutPassword.station_approved = false;
        }
        res.status(200).json({
            message: "Login successful",
            user: {
              ...userWithoutPassword
            },
            token,
          });

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
    // Validate that the userId in the URL is a valid UUID
    if (!isUUID(req.params.id)) {
      return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
    }
  
    try {
      const user_id = req.params.id;
      const token = req.body.token; // Token sent in the request body
      const user = await getUserByIdService(user_id); // Retrieve user from DB
  
      if (!user) {
        return res.status(404).json({ error: "User not found by this ID" });
      }
  
      const emailVerification = await getEmailVerificationByIdService(user_id); // Retrieve email verification status
      if (!emailVerification) {
        return res.status(404).json({ error: "Email Verification not found" });
      }
  
      if (emailVerification?.verified) {
        return res.status(400).json({ message: "Email is already verified." });
      }
  
      // Check if verification token is still valid
      if (new Date(emailVerification?.verification_expires_at) > new Date()) {
        if (emailVerification?.token === token) { 
          await verifyUserByIdService(user_id); 
          const updatedEmailVerification = await updateEmailVerificationByUserIdService(user_id); // Update verification status in DB
          // Send welcome email after successful verification
          await sendWelcomeEmail(user?.email, user?.username);
  
          return res.status(200).json({
            message: "Email verified successfully",
            emailVerification: updatedEmailVerification,
          });
        } else {
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


export const resendEmailVerification = async (req, res) => {
    try {
      const  user_id  = req.params.id;        // assume user_id comes from URL params
      
      const verificationToken = Math.floor(100000+Math.random()*900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  
      const updatedVerification = await resendEmailVerificationByUserIdService(
        user_id,
        verificationToken,
        { verification_expires_at:expiresAt }
      );
      
      const user = await getUserByIdService(user_id);
      
      if (!updatedVerification || !user) {
        return res.status(404).json({ message: 'User not found or no verification record found' });
      }
      await sendVerificationEmail(user.email,verificationToken);
      res.status(200).json({
        message: 'resend Email verification data ',
        data: updatedVerification,
      });
      
    } catch (error) {
      console.error('Error resending email verification:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

export const forgotPassWord = async (req, res) => {
    try {
      const  email  = req.body.email;        // assume user_id comes from URL params
      const user = await getUserByEmailService(email);
      if(!user){
        return res.status(404).json({ message: 'User not found with this email' });
      }
      const verificationToken = Math.floor(100000+Math.random()*900000).toString();
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  
      const updatedVerification = await forgotPasswordByEmailService(
        user.id,
        verificationToken,
        { verification_expires_at:expiresAt }
      );
      
      if (!updatedVerification) {
      await createEmailVerificationService(user.id,verificationToken,{ verification_expires_at:expiresAt })
      }
      await sendForgotPasswordEmail(email,verificationToken);
      res.status(200).json({
        message: 'forgot password send ',
        user_id: user.id,
      });
      
    } catch (error) {
      console.error('Error resending email verification:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


  export const forgotEmailVerify = async (req, res) => {
    // Validate that the userId in the URL is a valid UUID
    if (!isUUID(req.params.id)) {
      return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
    }
  
    try {
      const user_id = req.params.id;
      const token = req.body.token; // Token sent in the request body
      const user = await getUserByIdService(user_id); // Retrieve user from DB
  
      if (!user) {
        return res.status(404).json({ error: "User not found by this ID" });
      }
  
      const emailVerification = await getEmailVerificationByIdService(user_id); // Retrieve email verification status
      if (!emailVerification) {
        return res.status(404).json({ error: "Email Verification not found" });
      }
  
      
  
      // Check if verification token is still valid
      if (new Date(emailVerification?.verification_expires_at) > new Date()) {
        if (emailVerification?.token === token) { 
          await verifyUserByIdService(user_id); 
          const updatedEmailVerification = await updateEmailVerificationByUserIdService(user_id); // Update verification status in DB
          
  
          return res.status(200).json({
            message: "Email verified successfully to reset your password",
            user_id: user_id,
          });
        } else {
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


  export const newPassword = async (req, res) => {
    if (!isUUID(req.params.id)) {
      return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
    }
  
    try {
      const user_id = req.params.id;
      const newPassword = req.body.new_password;
  
      const user = await getUserByIdService(user_id); // Retrieve user from DB
      if (!user) {
        return res.status(404).json({ error: "User not found by this ID" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      await updateNewPasswordService(user_id, hashedPassword); // Update the user's password
      // Send confirmation email
      await sendForgotSuc
      
      cessfullEmail(user.email, user.username);
  
      return res.status(200).json({
        message: "Password changed successfully",
      });
  
    } catch (error) {
      console.error("Error in newPassword controller:", error.message);
      return res.status(500).json({ error: error.message });
    }
  };
  