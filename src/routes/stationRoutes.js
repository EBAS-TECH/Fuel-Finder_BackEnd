import express from "express";
import { changeStationLogo, createStation,
     deleteStationById,
     getAllStations, 
     getAllStationsByStatus, 
     getNearByStations, 
     getStationById, 
     getStationByUserId, 
     getStationsReports, 
     getStationsSuggestion, 
     updateStationById, 
     validateTin, 
     verifyStationById } from "../controllers/stationController.js";
import protectRoute from "../middlewares/protectRoute.js";
import authorizeRoles from "../middlewares/authorizeRole.js";
import { validateCreateStation } from "../middlewares/stationInputValidation.js";
import { upload } from "../middlewares/upload.js";
const router = express.Router();

router.post('/',validateCreateStation,createStation);
router.get('/validate-tin/:tinNumber', validateTin);
router.get('/user/:user_id',protectRoute,getStationByUserId);
router.get('/status/:status',protectRoute,authorizeRoles('ADMIN','MINISTRY_DELEGATE','DRIVER'),getAllStationsByStatus);
router.get('/',protectRoute,authorizeRoles('ADMIN','MINISTRY_DELEGATE','DRIVER'),getAllStations)
router.get('/:id',protectRoute,getStationById);
router.put('/update/:id',protectRoute,authorizeRoles('ADMIN'),updateStationById)
router.delete('/:id',protectRoute,authorizeRoles('ADMIN'),deleteStationById)
router.put('/verify-station/:id',protectRoute,authorizeRoles('ADMIN'),verifyStationById)
router.post('/near-station',protectRoute,getNearByStations)
router.post('/report/ministry',protectRoute,getStationsReports),
router.get('/suggestion/improve',protectRoute,getStationsSuggestion)
router.post("/profile/change-logo/:stationId",protectRoute,upload.single('logo'),changeStationLogo)


export default router;