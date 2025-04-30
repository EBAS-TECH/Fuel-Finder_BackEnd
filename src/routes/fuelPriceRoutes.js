import express from "express";

import protectRoute from "../middlewares/protectRoute.js";

import authorizeRoles from "../middlewares/authorizeRole.js";
import { createOrUpdateFuelPrice, deleteFuelPriceByType, getAllFuelPrices, getFuelPriceByType, updateFuelPrice } from "../controllers/fuelPriceController.js";


const router = express.Router();

// Create a new fuel price
router.post('/',protectRoute,authorizeRoles('MINISTRY_DELEGATE'),createOrUpdateFuelPrice);

// Get all fuel price 
router.get('/',protectRoute,getAllFuelPrices);

// Get fuel price by type
router.get('/:fuel_type',protectRoute,getFuelPriceByType);

// Update a fuel price by fuel type
router.put('/:fuel_type',protectRoute,authorizeRoles('MINISTRY_DELEGATE'),updateFuelPrice);

// Delete a fuel price by fuel type
router.delete('/:fuel_type',protectRoute,authorizeRoles('MINISTRY_DELEGATE','ADMIN'),deleteFuelPriceByType);

export default router;