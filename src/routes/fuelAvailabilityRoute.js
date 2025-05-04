import express from "express";

import protectRoute from "../middlewares/protectRoute.js";
import { createFuelAvailability, 
    deleteFuelAvailabilityById, 
    getAllFuelAvailabilities, 
    getFuelAvailabilitiesById, 
    getFuelAvailabilitiesByStationId, 
    getFuelAvailabilityByStationAndFuelType, 
    updateFuelAvailabilityById,
    getLastFuelAvailabilityByStationAndFuelType, 
    getAllAvailabilityHoursByUserId} from "../controllers/fuelAvailabilityController.js";
import authorizeRoles from "../middlewares/authorizeRole.js";



const router = express.Router();

// Get all fuel availability 
router.get('/',protectRoute,authorizeRoles('GAS_STATION'),getAllFuelAvailabilities);

// Get fuel availability by ID
router.get('/:id',protectRoute,getFuelAvailabilitiesById);

// Get fuel availability by ID
router.get('/station/:id',protectRoute,getFuelAvailabilitiesByStationId);

// Create a new fuel availability
router.post('/',protectRoute,authorizeRoles('GAS_STATION','ADMIN'),createFuelAvailability);

// Update a fuel availability by ID
router.put('/:id',protectRoute,authorizeRoles('GAS_STATION','ADMIN'),updateFuelAvailabilityById);

// Delete a fuel availability by ID
router.delete('/:id',protectRoute,deleteFuelAvailabilityById);

router.get('/StationAndFuelType',protectRoute,getFuelAvailabilityByStationAndFuelType);

router.put('/isAvailable/:id',protectRoute,getLastFuelAvailabilityByStationAndFuelType);
router.post('/duration',protectRoute,getAllAvailabilityHoursByUserId);``

export default router;