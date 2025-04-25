import jwt from "jsonwebtoken";
import { getUserByIdService } from "../models/userModel.js";
const protectRoute = async (req,res,next)=>{
    console.log('Request in protectRoute:', req.params);
    try {
        const token = req.cookies.jwt
        if(!token){
            return res.status(401).json({error:"Unauthorized - NO token provided"})
        }
        const decoded= jwt.verify(token,process.env.JWT_SECRET)

        if(!decoded){
            return res.status(401).json({error:"Unauthorized - Invalid token"})
        }
        
        const { password, ...userWithoutPassword } = await getUserByIdService(decoded.userId);
        if(!userWithoutPassword){
            return res.status(404).json({error:"User not found"})
        }
        req.user = userWithoutPassword;

        next();

    } catch (error) {
        
        console.log("error in protectRoute middleware", error.message)
        res.status(500).json({ error: error.message })
    }
}

export default protectRoute;