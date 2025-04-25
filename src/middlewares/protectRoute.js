import jwt from "jsonwebtoken";
import { getStationByUserIdService } from "../models/stationModel.js";
import { getUserByIdService } from "../models/userModel.js";

// 👇 Local helper method
const validateStationStatus = (station) => {
  if (!station) {
    return { valid: false, message: "Station not found with user" };
  }

  if (station.status === "PENDING") {
    return { valid: false, message: "Station is in pending state" };
  }

  if (station.status === "NOT-VERIFIED") {
    return { valid: false, message: "Station is not verified" };
  }

  return { valid: true };
};


const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
    console.log("token",token)

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decoded",decoded)

    const {password,userWithoutPassword} = await getUserByIdService(decoded.userId);

    if (!userWithoutPassword) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userWithoutPassword.role === "GAS_STATION") {
      const station = await getStationByUserIdService(userWithoutPassword.id);
      const validation = validateStationStatus(station);

      if (!validation.valid) {
        return res.status(403).json({ error: validation.message });
      }
    }

    req.user = userWithoutPassword;
    next();

  } catch (error) {
    console.log("Error in protectRoute middleware:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export default protectRoute;
