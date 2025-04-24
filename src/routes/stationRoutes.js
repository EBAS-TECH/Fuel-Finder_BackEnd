import express from "express";
import { createStation, getNearByStationsService } from "../controllers/stationController.js";
const router = express.Router();

router.post('/',createStation);
router.post('/near-station',getNearByStationsService)


export default router;