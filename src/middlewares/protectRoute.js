import jwt from "jsonwebtoken";
import { getStationByUserIdService } from "../service/stationService.js";
import { getUserByIdService } from "../service/userService.js";

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
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized - No token provided" });
    }
    

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await getUserByIdService(decoded.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found or invalid token" });
    }
    const {password,...userWithoutPassword}= user;

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
    res.status(500).json({ message: "Internal server error",error:error.message });
  }
};

export default protectRoute;
