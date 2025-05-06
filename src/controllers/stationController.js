import { changeAvailabilityStationByIdService, createStationService, 
    deleteStationByIdService, 
    getAllStationsByStatusService, 
    getAllStationsService, 
    getNearbyStationsService, 
    getStationByIdService, 
    getStationByUserIdService, 
    updateStationByIdService, 
    verifyStationByIdService } from "../service/stationService.js";
import { createUserService, deleteUserService, getUserByUsernameService } from "../service/userService.js";
import { validate as isUUID } from "uuid";
import bcrypt from "bcryptjs";
import axios from 'axios';
import { sendVerificationEmail } from "../utils/emailNotification/emails.js";
import { createEmailVerificationService } from "../service/emailVerificationService.js";
import geminiSuggestStations from "../utils/geminiService.js";
import { deleteFeedbacksByStationIdService, getAverageRateByStationIdService } from "../service/feedbackService.js";
import { deleteFavoritesByStationIdService, getListFavoritesByUserIdService } from "../service/favoriteService.js";
import { deleteFuelAvailabilityByStaionIdService, getAllAvailabilityHours, getAvailableFuelTypeByStationIdService } from "../service/fuelAvailabilityService.js";


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
  export const getStationByUserId = async (req, res, next) => {
    if (!isUUID(req.params.user_id)) {
        return res.status(400).json({ error: "Invalid token payload: userId is not a valid UUID" });
      }
    const { user_id } = req.params;
  
    try {
      const station = await getStationByUserIdService(user_id);
  
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
      await deleteFuelAvailabilityByStaionIdService(id);
      await deleteFeedbacksByStationIdService(id);
      await deleteFavoritesByStationIdService(id);
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
      const user_id = req.user.id;
      const { latitude, longitude, radius = 10000, limit = 8 } = req.body;
  
      if (isNaN(latitude) || isNaN(longitude)) {
        return res.status(400).json({ message: "Invalid latitude or longitude values" });
      }
  
      const favoritesStationIds = await getListFavoritesByUserIdService(user_id);
  
      const nearStations = await getNearbyStationsService(latitude, longitude, radius, limit);
      // console.log(nearStations)
      if (nearStations.length === 0) {
        return handleResponse(res, 200, "No nearby stations found", nearStations);
      }
      const geminiSations = [];
  
      for (const station of nearStations) {
        const now = new Date();
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
       
        const availability = await getAllAvailabilityHours(
          thirtyDaysAgo.toISOString(),
          now.toISOString(),
          station.id
        );
        const totalMilliseconds = availability.reduce((sum, item) => {
          return sum + parseFloat(item.total_milliseconds);
        }, 0);
        
        const averageRateRaw = await getAverageRateByStationIdService(station.id);
        const averageRate = averageRateRaw !== null 
          ? parseFloat(parseFloat(averageRateRaw).toFixed(2)) 
          : null;
        

          const available_fuel = await getAvailableFuelTypeByStationIdService(station.id);
  
        geminiSations.push({
          id: station?.id,
          rating: averageRate,
          distance: station.distance,
          isFavorite: favoritesStationIds.includes(station.id),
          availability:totalMilliseconds
        });
      }
      
  
      const suggestion = await geminiSuggestStations(geminiSations);
      const cleaned = suggestion.replace(/```json|```/g, '').trim();
      
      let parsedSuggestion;
      try {
        parsedSuggestion = JSON.parse(cleaned);
        } catch (error) {
          console.error("Failed to parse suggestion:", error);
          parsedSuggestion = {};
          }
          const suggestedStationIds = Object.values(parsedSuggestion).filter(Boolean);
          let count = 1;
          const suggestedStations = [];
          for (const key in parsedSuggestion) {
            const value = parsedSuggestion[key];
            if (value) {
              const averageRateRaw = await getAverageRateByStationIdService(parsedSuggestion[key]);
              const averageRate = averageRateRaw !== null 
                  ? parseFloat(parseFloat(averageRateRaw).toFixed(2)) 
                  : null;
  
              const available_fuel = await getAvailableFuelTypeByStationIdService(parsedSuggestion[key]);
              suggestedStations.push({
                  rank:key,
                  id:parsedSuggestion[key],
                  name:nearStations.find(station=>station.id==parsedSuggestion[key]).en_name,
                  averageRate:averageRate,
                  available_fuel:available_fuel,
                  isFavorite: favoritesStationIds.includes(parsedSuggestion[key]),
                  suggestion:true,
                  latitude:nearStations.find(station=>station.id==parsedSuggestion[key]).latitude,
                  longitude:nearStations.find(station=>station.id==parsedSuggestion[key]).longitude,
                  distance:nearStations.find(station=>station.id==parsedSuggestion[key]).distance
              })
              count++;
            }
          }
      
          
          for (const station of nearStations) {
            if(!suggestedStationIds.includes(station.id)){
            const averageRateRaw = await getAverageRateByStationIdService(station.id);
            const averageRate = averageRateRaw !== null 
              ? parseFloat(parseFloat(averageRateRaw).toFixed(2)) 
              : null;
      
            const available_fuel = await getAvailableFuelTypeByStationIdService(station.id);
      
            suggestedStations.push({
              rank:count.toString(),
              id:station.id,
              name: station.en_name,
              rating: averageRate,
              averageRate:averageRate,
              available_fuel:available_fuel,
              isFavorite:favoritesStationIds.includes(station.id),
              suggestion:false,
              latitude:station.latitude,
              longitude:station.longitude,
              distance:station.distance
            });
            count ++;
          }
          }

  
      
  
      return handleResponse(res, 200, "Nearby stations retrieved successfully", suggestedStations);
    } catch (err) {
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
    return res.status(response.status).json({
      first_name:response.data.AssociateShortInfos[0].ManagerName.split(" ")[0],
      last_name:response.data.AssociateShortInfos[0].ManagerName.split(" ")[1]});

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