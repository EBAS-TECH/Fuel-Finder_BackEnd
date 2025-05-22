import {
  changeAvailabilityStationByIdService, changeStationLogoService, createStationService,
  deleteStationByIdService,
  getAllStationsByStatusService,
  getAllStationsService,
  getListStationIdService,
  getNearbyStationsService,
  getStationByIdService,
  getStationByUserIdService,
  updateStationByIdService,
  verifyStationByIdService
} from "../service/stationService.js";
import { createUserService, deleteUserService, getUserByEmailService, getUserByIdService, getUserByUsernameService, updateUserWithEmailService } from "../service/userService.js";
import { validate as isUUID } from "uuid";
import bcrypt from "bcryptjs";
import axios from 'axios';
import { sendVerificationEmail } from "../utils/emailNotification/emails.js";
import { createEmailVerificationService } from "../service/emailVerificationService.js";
import { geminiCategorizeAndSuggestStations, geminiSuggestStationsForNearStations } from "../utils/geminiService.js";
import { deleteFeedbacksByStationIdService, getAverageRateByStationIdService } from "../service/feedbackService.js";
import { deleteFavoritesByStationIdService, getFavoriteByStationIdService, getListFavoritesByUserIdService } from "../service/favoriteService.js";
import { deleteFuelAvailabilityByStaionIdService, getAllAvailabilityHours, getAvailableFuelTypeByStationIdService } from "../service/fuelAvailabilityService.js";
import { getUserById, updateUserById } from "./userController.js";
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



export const createStation = async (req, res, next) => {
  const { first_name, last_name, username, password, email, role, profile_pic } = req.body.user;
  const { en_name, am_name, tin_number, latitude, longitude, address } = req.body;

  // Check if the username already exists
  const user = await getUserByUsernameService(username);
  if (user) {
    return res.status(400).json({ error: "Username already exists" });
  }

  // Hash the password and create the default profile picture
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const defaultProfilePic = profile_pic || `https://avatar.iran.liara.run/public/boy?username=${username}`;
  const logo = "https://img.icons8.com/color/96/gas-pump.png";
  const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
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
      address,
      logo
    );
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    await createEmailVerificationService(
      newUser.id,
      verificationToken,
      {
        verification_expires_at: expiresAt,
      }
    );
    await sendVerificationEmail(newUser.email, verificationToken)
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
  const status = req.params.status;
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
        return res.status(400).json({ error: "Invalid token payload: station is not a valid UUID" });
      }
    const { id } = req.params;
  console.log(id)
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
    const verifiedStation = await verifyStationByIdService(id, status);

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
  const { en_name, am_name, address, tin_number, user_id, latitude, longitude, logo } = req.body;
  const { first_name, last_name, username, password, email } = req.body.user;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    const station = await getStationByIdService(id);
    if (station?.user_id != user_id) {
      return res.status(400).json({ error: "user id is not exist" });
    }
    const user1 = await getUserByEmailService(email);
    if (user1 && user1.email != email) {
      return res.status(400).json({ error: "email already exists" });
    }
    const user2 = await getUserByUsernameService(username);
    if (user2 && user2.username != username) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const updatedUser = await updateUserWithEmailService(user_id, first_name, last_name, username, email, hashedPassword)
    const updatedStation = await updateStationByIdService(id, en_name, am_name, tin_number, user_id, latitude, longitude, address);
    // const user 
    if (!updatedStation) {
      return handleResponse(res, 404, "Station not found", null);
    }
    const { password, ...userWithoutPassword } = updatedUser;
    updatedStation.user = userWithoutPassword;

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


export const getNearByStations = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const { latitude, longitude, radius = 10000, limit = 8 } = req.body;

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: "Invalid latitude or longitude values" });
    }
    const favoritesStationIds = await getListFavoritesByUserIdService(user_id);

    const nearStations = await getNearbyStationsService(latitude, longitude, radius, limit);

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
        availability: totalMilliseconds
      });
    }


    const suggestion = await geminiSuggestStationsForNearStations(geminiSations);
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
          rank: key,
          id: parsedSuggestion[key],
          name: nearStations.find(station => station.id == parsedSuggestion[key]).en_name,
          averageRate: averageRate,
          available_fuel: available_fuel,
          isFavorite: favoritesStationIds.includes(parsedSuggestion[key]),
          suggestion: true,
          latitude: nearStations.find(station => station.id == parsedSuggestion[key]).latitude,
          longitude: nearStations.find(station => station.id == parsedSuggestion[key]).longitude,
          distance: Math.round((nearStations.find(station => station.id == parsedSuggestion[key]).distance / 1000) * 100) / 100,
          logo: nearStations.find(station => station.id == parsedSuggestion[key]).logo
        })
        count++;
      }
    }


    for (const station of nearStations) {
      if (!suggestedStationIds.includes(station.id)) {
        const averageRateRaw = await getAverageRateByStationIdService(station.id);
        const averageRate = averageRateRaw !== null
          ? parseFloat(parseFloat(averageRateRaw).toFixed(2))
          : null;

        const available_fuel = await getAvailableFuelTypeByStationIdService(station.id);

        suggestedStations.push({
          rank: count.toString(),
          id: station.id,
          name: station.en_name,
          rating: averageRate,
          averageRate: averageRate,
          available_fuel: available_fuel,
          isFavorite: favoritesStationIds.includes(station.id),
          suggestion: false,
          latitude: station.latitude,
          longitude: station.longitude,
          distance: station.distance,
          logo: station.logo
        });
        count++;
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

    const associateInfos = response.data.AssociateShortInfos;

    if (!Array.isArray(associateInfos) || associateInfos.length === 0) {
      return res.status(404).json({ success: false, message: 'No associate information found for this TIN.' });
    }

    const managerName = associateInfos[0].ManagerName;

    if (!managerName || typeof managerName !== 'string') {
      return res.status(404).json({ message: 'Manager name not available for this TIN.' });
    }

    const nameParts = managerName.trim().split(" ");
    const first_name = nameParts[0] || '';
    const last_name = nameParts[1] || '';

    return res.status(response.status).json({
      first_name,
      last_name,
    });

  } catch (error) {
    console.error('Error while validating TIN:', error.message);

    if (error.response) {
      return res
        .status(error.response.status)
        .json({ message: error.response.data?.message || 'Error from ETrade server.' });
    } else if (error.request) {
      return res
        .status(500)
        .json({ message: 'No response from ETrade server. Please try again later.' });
    } else {
      return res
        .status(500)
        .json({ message: 'Unexpected error occurred: ' + error.message });
    }
  }
};


export const getStationsReports = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const stationIds = await getListStationIdService();
    const { start_date, end_date } = req.body;

    const geminiStations = [];
    const stations = await getAllStationsByStatusService('VERIFIED');

    for (const station of stations) {
      const availability = await getAllAvailabilityHours(
        new Date(start_date).toISOString(),
        new Date(end_date).toISOString(),
        station.id
      );

      const totalMilliseconds = availability.reduce((sum, item) => {
        return sum + parseFloat(item.total_milliseconds);
      }, 0);

      const averageRateRaw = await getAverageRateByStationIdService(station.id);
      const averageRate = averageRateRaw !== null
        ? parseFloat(Number(averageRateRaw).toFixed(2))
        : null;

      const favorites = await getFavoriteByStationIdService(station.id);
      const available_fuel = await getAvailableFuelTypeByStationIdService(station.id);

      geminiStations.push({
        id: station.id,
        rating: averageRate ?? 0,
        favorites_user: favorites.length,
        availability: totalMilliseconds
      });
    }

    const hasAvailable = geminiStations.some(station => station.availability > 0);

    // If no available stations, return an empty list
    if (!hasAvailable) {
      return handleResponse(res, 200, "No stations available in the specified period.", []);
    }

    // Process suggestion if there are available stations
    const suggestion = await geminiCategorizeAndSuggestStations(geminiStations);
    const cleaned = suggestion.replace(/```json|```/g, '').trim();

    let parsedSuggestion;
    try {
      parsedSuggestion = JSON.parse(cleaned);
    } catch (error) {
      console.error("Failed to parse suggestion:", error);
      return handleResponse(res, 200, "Invalid station suggestion format.", []);
    }

    const ReportedStations = [];

    for (const station of parsedSuggestion?.stations || []) {
      if (station.availability > 0) {
        const match = stations.find(s => s.id === station.stationId);

        station.name = match?.en_name || "Unknown";
        station.tinNumber = match?.tin_number || "Unknown";
        station.logo = match?.logo || null;

        const availability = await getAllAvailabilityHours(
          new Date(start_date).toISOString(),
          new Date(end_date).toISOString(),
          station.stationId
        );

        const totalHours = availability.reduce((sum, item) => {
          return sum + parseFloat(item.total_milliseconds);
        }, 0) / (1000 * 60 * 60);

        const averageRateRaw = await getAverageRateByStationIdService(station.stationId);
        const averageRate = averageRateRaw !== null
          ? parseFloat(parseFloat(averageRateRaw).toFixed(2))
          : 0;

        station.rating = averageRate;
        station.availaleHour = totalHours;

        ReportedStations.push(station);
      }
    }

    return handleResponse(res, 200, "Reported stations retrieved successfully.", ReportedStations);

  } catch (err) {
    next(err);
  }
};


export const getStationsSuggestion = async (req, res, next) => {
  try {
    const user_id = req.user.id;
    const filterStation= await getStationByUserIdService(user_id);
    const filteredStationId = filterStation.id;
    const stationIds = await getListStationIdService();

    const geminiStations = [];
    const stations = await getAllStationsByStatusService('VERIFIED');

    for (const station of stations) {
      const end_date = new Date();

      const start_date = new Date();
      start_date.setDate(end_date.getDate() - 30);

      const availability = await getAllAvailabilityHours(
        start_date.toISOString(),
        end_date.toISOString(),
        station.id
      );

      const totalMilliseconds = availability.reduce((sum, item) => {
        return sum + parseFloat(item.total_milliseconds);
      }, 0);

      const averageRateRaw = await getAverageRateByStationIdService(station.id);
      const averageRate = averageRateRaw !== null
        ? parseFloat(Number(averageRateRaw).toFixed(2))
        : null;

      const favorites = await getFavoriteByStationIdService(station.id);
      const available_fuel = await getAvailableFuelTypeByStationIdService(station.id);

      geminiStations.push({
        id: station.id,
        rating: averageRate ?? 0,
        favorites_user: favorites.length,
        availability: totalMilliseconds
      });
    }

    const hasAvailable = geminiStations.some(station => station.availability > 0);

    // If no available stations, return an empty list
    if (!hasAvailable) {
      return handleResponse(res, 200, "No stations available in the specified period.", []);
    }

    // Process suggestion if there are available stations
    const suggestion = await geminiCategorizeAndSuggestStations(geminiStations);
    const cleaned = suggestion.replace(/```json|```/g, '').trim();

    let parsedSuggestion;
    try {
      parsedSuggestion = JSON.parse(cleaned);
    } catch (error) {
      console.error("Failed to parse suggestion:", error);
      return handleResponse(res, 200, "Invalid station suggestion format.", []);
    }
    const filteredStation = parsedSuggestion.stations.find(
      station => station.stationId === filteredStationId
    );
    const match = stations.find(s => s.id === filteredStationId);
    filteredStation.name = match?.en_name || "Unknown";
    filteredStation.tinNumber = match?.tin_number || "Unknown";
    filteredStation.logo = match?.logo || null;

    const end_date = new Date();

      const start_date = new Date();
      start_date.setDate(end_date.getDate() - 30);
    const availability = await getAllAvailabilityHours(
      new Date(start_date).toISOString(),
      new Date(end_date).toISOString(),
      filteredStation.stationId
    );

    const totalHours = availability.reduce((sum, item) => {
      return sum + parseFloat(item.total_milliseconds);
    }, 0) / (1000 * 60 * 60);

    const averageRateRaw = await getAverageRateByStationIdService(filteredStationId);
    const averageRate = averageRateRaw !== null
      ? parseFloat(parseFloat(averageRateRaw).toFixed(2))
      : 0;

    filteredStation.rating = averageRate;
    filteredStation.availaleHour = totalHours;

    return handleResponse(res, 200, "station suggestion retrieved successfully.", filteredStation);

  } catch (err) {
    next(err);
  }
};


export const changeStationLogo = async (req, res) => {
  // Cloudinary configuration
  cloudinary.config({
    cloud_name: process.env.CLOUDNARY_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET
  });

  try {
    const userId = req.user.id;
    const station_id = req.params.stationId;

    if (!req.file) return res.status(400).json({ error: "Station logo is required" });


    const user = await getUserByIdService(userId);
    if (!user) return handleResponse(res, 404, "User not found");

    // Upload to Cloudinary
    const uploadStream = () => new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'stations_logo', public_id: `user_${userId}_${Date.now()}` },
        (err, result) => err ? reject(err) : resolve(result)
      );
      streamifier.createReadStream(req.file.buffer).pipe(stream);
    });
    // Update user profile with hosted image URL
    const result = await uploadStream();
    console.log()
    const updatedStation = await changeStationLogoService(station_id, result.secure_url);
    console.log(updatedStation)

    res.status(200).json({
      message: "Station logo updated successfully",
      logo: updatedStation.logo
    });
  } catch (error) {
    console.error("Error changing profile picture:", error.message);
    res.status(400).json({ error: error.message });
  }
};