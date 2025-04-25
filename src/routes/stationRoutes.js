import express from "express";
import { createStation,
     deleteStationById,
     getAllStations, 
     getAllStationsByStatus, 
     getNearByStationsService, 
     getStationById, 
     validateTin, 
     verifyStationById } from "../controllers/stationController.js";
import protectRoute from "../middlewares/protectRoute.js";
import authorizeRoles from "../middlewares/authorizeRole.js";
const router = express.Router();

router.post('/',createStation);
router.get('/',protectRoute,authorizeRoles('ADMIN','MINISTRY_DELEGATE','DRIVER'),getAllStations)
router.get('/status/:status',protectRoute,authorizeRoles('ADMIN','MINISTRY_DELEGATE','DRIVER'),getAllStationsByStatus)
router.get('/:id',protectRoute,getStationById)
router.delete('/:id',protectRoute,authorizeRoles('ADMIN'),deleteStationById)
router.put('/verify-station/:id',protectRoute,authorizeRoles('ADMIN'),verifyStationById)
router.post('/near-station',protectRoute,getNearByStationsService)
router.get('/validate-tin/:tinNumber', validateTin);


export default router;