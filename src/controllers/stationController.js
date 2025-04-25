import { createStationService, 
    deleteStationByIdService, 
    getAllStationsByStatusService, 
    getAllStationsService, 
    getNearbyStationsService, 
    getStationByIdService, 
    updateStationByIdService, 
    verifyStationByIdService } from "../models/stationModel.js";
import { createUserService, deleteUserService, getUserByUsernameService } from "../models/userModel.js";
import { validate as isUUID } from "uuid";
import bcrypt from "bcryptjs";
import axios from 'axios';
import { sendVerificationEmail } from "../utils/emailNotification/emails.js";
import { createEmailVerificationService } from "../models/emailVerificationModel.js";


// Standardized response function
const handleResponse = (res, status, message, data = null) => {
    res.status(status).json({
      status,
      message,
      data,
    });
  };


  export const createStation = async (req, res, next) => {
    const { first_name, last_name, username, password, email, role, profile_pic } = req.body.user;
    const { en_name, am_name,tin_number, latitude, longitude, address } = req.body;
  
    // Check if the username already exists
    const user = await getUserByUsernameService(username);
    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }
  
    // Hash the password and create the default profile picture
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const defaultProfilePic = profile_pic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const verificationToken = Math.floor(100000+Math.random()*900000).toString();
    try {
      // Create the user
      const newUser = await createUserService(
        first_name,
        last_name,
        username,
        hashedPassword,
        email,
        role,
        defaultProfilePic
      );
  
      // After creating the user, create the station and associate the user with the station
      const newStation = await createStationService(
        en_name,
        am_name,
        tin_number,
        newUser.id,  // Now `newUser.id` is used as user reference
        latitude,
        longitude,
        address
      );
      const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await createEmailVerificationService(
                      newUser.id,
                      verificationToken,
                      {
                          verification_expires_at: expiresAt,
                      }
                  );
      await sendVerificationEmail(newUser.email,verificationToken)
      const { password, ...userWithoutPassword } = newUser;
      newStation.user = userWithoutPassword;
      // Return a successful response with the created station
      handleResponse(res, 201, "User and Station created successfully", newStation);
    } catch (err) {
      next(err);
    }
  };
  
  export const getAllStations = async (req, res, next) => {
    try {
      const stations = await getAllStationsService();
      
      if (stations.length === 0) {
        return handleResponse(res, 200, "No stations found", stations);
      }
      handleResponse(res, 200, "Stations retrieved successfully", stations);
   
    } catch (err) {
      next(err);
    }
  };
export const getAllStationsByStatus = async (req, res, next) => {
    const  status  = req.params.status;  
    try {
      const stations = await getAllStationsByStatusService(status);
      
      // Ensure stations is an array before checking its length
      if (!Array.isArray(stations)) {
        throw new Error('Invalid response format from getAllStationsByStatus');
      }

      if (stations.length === 0) {
        return handleResponse(res, 200, `No ${status} stations found`, stations);
      }

      handleResponse(res, 200, `${status} Stations retrieved successfully`, stations);
   
    } catch (err) {
      next(err); 
    }
};


  export const getStationById = async (req, res, next) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
      }
    const { id } = req.params;
  
    try {
      const station = await getStationByIdService(id);
  
      if (!station) {
        return handleResponse(res, 404, "Station not found", null);
      }
  
      handleResponse(res, 200, "Station retrieved successfully", station);
    } catch (err) {
      next(err);
    }
  };

  
  export const deleteStationById = async (req, res, next) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
      }
    const { id } = req.params;
  
    try {
      const deletedStation = await deleteStationByIdService(id);
  
      if (!deletedStation) {
        return handleResponse(res, 404, "Station not found", null);
      }
      const deletedUser = await deleteUserService(deletedStation.user_id)
      if (!deletedUser) {
        return handleResponse(res, 404, "user not found when station is deleted", null);
      }
  
      handleResponse(res, 200, "Station and station user deleted successfully", deletedStation);
    } catch (err) {
      next(err);
    }
  };

  export const verifyStationById = async (req, res, next) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
      }
    const { id } = req.params;
    const status = req.body.status;
  
    try {
      const verifiedStation = await verifyStationByIdService(id,status);
  
      if (!verifiedStation) {
        return handleResponse(res, 404, "Station not found", null);
      }
  
      handleResponse(res, 200, "Station verified successfully", verifiedStation);
    } catch (err) {
      next(err);
    }
  };

  export const updateStationById = async (req, res, next) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
      }
    const { id } = req.params;
    const { en_name, am_name, address } = req.body;
  
    try {
      const updatedStation = await updateStationByIdService(id, en_name, am_name, address);
  
      if (!updatedStation) {
        return handleResponse(res, 404, "Station not found", null);
      }
  
      handleResponse(res, 200, "Station updated successfully", updatedStation);
    } catch (err) {
      next(err);
    }
  };
  
  export const changeAvailabilityStationById = async (req, res, next) => {
    if (!isUUID(req.params.id)) {
        return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
      }
    const { id } = req.params;
    const { availability } = req.body;
  
    try {
      const updatedStation = await changeAvailabilityStationByIdService(id, availability);
  
      if (!updatedStation) {
        return handleResponse(res, 404, "Station not found", null);
      }
  
      handleResponse(res, 200, "Station availability updated successfully", updatedStation);
    } catch (err) {
      next(err);
    }
  };
  

  export const getNearByStationsService = async (req, res, next) => {
    try {
      const { latitude, longitude, radius = 10000, limit = 3 } = req.body;

      // Ensure latitude and longitude are valid numbers
    if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Invalid latitude or longitude values" });
      }
  
      // Call the service to get nearby stations
      const stations = await getNearbyStationsService(latitude, longitude, radius, limit);
  
      // Check if any stations were found
      if (stations.length === 0) {
        return handleResponse(res, 200, "No nearby stations found", stations); 
      }
  
      // Return the list of nearby stations with distance
      return handleResponse(res, 200, "Nearby stations retrieved successfully", stations); 
    } catch (err) {
      // Catch any errors and pass them to the error handler
      next(err);
    }
  };
  
  
export const validateTin = async (req, res) => {
  const etradeHost = 'https://etrade.gov.et';
  const { tinNumber } = req.params;
  const externalApiUrl = `${etradeHost}/api/Registration/GetRegistrationInfoByTin/${tinNumber}/am`;

  try {
    const response = await axios.get(externalApiUrl, {
      headers: {
        Referer: etradeHost,
        Origin: etradeHost,
      },
    });

    return res.status(response.status).json(response.data);

  } catch (error) {
    if (error.response) {
      return res
        .status(error.response.status)
        .json({ message: error.response.data || error.message });
    } else if (error.request) {
      return res
        .status(500)
        .json({ message: 'No response from ETrade server' });
    } else {
      return res
        .status(500)
        .json({ message: error.message });
    }
  }
};