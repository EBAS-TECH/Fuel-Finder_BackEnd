import {
    createFavoriteService,
    getAllFavoritesService,
    getFavoritesByUserIdService,
    getFavoriteByUserIdAndStationIdService,
    deleteFavoriteByIdService,
    deleteFavoriteByUserIdAndStationIdService,
    getListFavoritesByUserIdService
  } from '../service/favoriteService.js';
  
  import { validate as isUUID } from "uuid";
import { getStationByIdService } from '../service/stationService.js';
import { getAverageRateByStationIdService } from '../service/feedbackService.js';
import { getAvailableFuelTypeByStationIdService } from '../service/fuelAvailabilityService.js';
  
  // Create favorite
  export const createFavorite = async (req, res) => {
    try {
      const user_id = req.user.id;
      const { station_id } = req.body;
      if (!isUUID(user_id) || !isUUID(station_id)) {
        return res.status(400).json({ success: false, message: "Invalid UUIDs" });
      }
  
      // Prevent duplicates
      const exists = await getFavoriteByUserIdAndStationIdService(user_id, station_id);
      if (exists) {
        return res.status(409).json({ success: false, message: "Favorite already exists" });
      }
  
      const favorite = await createFavoriteService(user_id, station_id);
      res.status(201).json({ success: true, data: favorite });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to create favorite", error });
    }
  };
  
  // Get all favorites
  export const getAllFavorites = async (req, res) => {
    try {
      const favorites = await getAllFavoritesService();
      res.status(200).json({ success: true, data: favorites });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch favorites", error });
    }
  };
  
  // Get favorites by user
  export const getFavoritesByUser = async (req, res) => {
    try {
      const user_id = req.user.id;
      const favorites = await getFavoritesByUserIdService(user_id);
      res.status(200).json({ success: true, data: favorites });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch user favorites", error });
    }
  };
  
  // Delete favorite by user and station
  export const deleteFavorite = async (req, res) => {
    try {
      const user_id = req.user.id;
      const { station_id } = req.params;
  
      if (!isUUID(station_id)) {
        return res.status(400).json({ success: false, message: "Invalid station_id" });
      }
  
      const deleted = await deleteFavoriteByUserIdAndStationIdService(user_id, station_id);
      if (!deleted) {
        return res.status(404).json({ success: false, message: "Favorite not found" });
      }
  
      res.status(200).json({ success: true, message: "Favorite removed", data: deleted });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to delete favorite", error });
    }
  };
  
  // Get favorites by user
  export const getListFavoritesByUser = async (req, res) => {
    try {
      const user_id = req.user.id;
      const favoritesStationIds = await getListFavoritesByUserIdService(user_id);
      const stations = [];
      for (const stationId of favoritesStationIds) {
        const station = await getStationByIdService(stationId);
        const averageRateRaw =  await getAverageRateByStationIdService(stationId);
        const averageRate = averageRateRaw !== null 
             ? parseFloat(parseFloat(averageRateRaw).toFixed(2)) 
              : null;console.log(averageRateRaw)
        const available_fuel = await getAvailableFuelTypeByStationIdService(stationId);
      
        stations.push({
          name: station?.en_name,
          averageRate: averageRate,
          available_fuel: available_fuel
        });
      }
      res.status(200).json({ success: true, data: stations });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to fetch user favorites", error });
    }
  };