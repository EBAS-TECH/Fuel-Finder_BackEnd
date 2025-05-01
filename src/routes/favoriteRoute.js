import express from "express";

import protectRoute from "../middlewares/protectRoute.js";
import { createFavorite, deleteFavorite, getAllFavorites, getFavoritesByUser, getListFavoritesByUser } from "../controllers/favoriteController.js";
import authorizeRoles from "../middlewares/authorizeRole.js";

const router = express.Router();


router.post("/",protectRoute,authorizeRoles('DRIVER'),createFavorite);
router.get("/",protectRoute,getAllFavorites)
router.get("/user/",protectRoute,authorizeRoles('DRIVER','ADMIN'),getFavoritesByUser);
router.get("/user/stations",protectRoute,authorizeRoles('DRIVER','ADMIN'),getListFavoritesByUser);
router.delete("/:station_id",protectRoute,authorizeRoles('DRIVER'),deleteFavorite);

export default router;