import jwt from "jsonwebtoken";
import { getUserByIdService } from "../models/userModel.js";
import { getStationByUserIdService } from "../models/stationModel.js";

// ✅ Local helper function
const validateStationStatus = (station) => {
  if (!station) {
    return { valid: false, message: "Station not found for the user" };
  }

  const statusErrors = {
    "PENDING": "Station is in pending state",
    "NOT-VERIFIED": "Station is not verified"
  };

  if (statusErrors[station.status]) {
    return { valid: false, message: statusErrors[station.status] };
  }

  return { valid: true };
};

// ✅ Middleware
const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ error: "Unauthorized - NO token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    const { password, ...userWithoutPassword } = await getUserByIdService(decoded.userId);

    if (!userWithoutPassword) {
      return res.status(404).json({ error: "User not found" });
    }

    if (userWithoutPassword.role === 'GAS_STATION') {
      const station = await getStationByUserIdService(userWithoutPassword.id);
      const validation = validateStationStatus(station);

      if (!validation.valid) {
        return res.status(404).json({ error: validation.message });
      }
    }

    req.user = userWithoutPassword;
    next();

  } catch (error) {
    console.log("error in protectRoute middleware", error.message);
    res.status(500).json({ error: error.message });
  }
};

export default protectRoute;
