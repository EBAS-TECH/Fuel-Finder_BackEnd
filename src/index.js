import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import stationRoutes from "./routes/stationRoutes.js";
import fuelAvailabilityRoutes from "./routes/fuelAvailabilityRoute.js";
import feedbackRoutes from "./routes/feedbackRoute.js";
import favoriteRoutes from "./routes/favoriteRoute.js";
import fuelPriceRoutes from "./routes/fuelPriceRoutes.js";
import commentRoutes from "./routes/generalCommentRoute.js"
import errorHandling from "./middlewares/errorHandler.js";
import setupDatabase  from "./data/setupDatabase.js";
import { swaggerDocument, swaggerUi, swaggerUiSetup } from "./utils/docs/swagger.js";
import basicAuth from 'express-basic-auth';

dotenv.config();

const app = express();

const port = process.env.PORT || 3001;

// app.get('/',async(req,res)=>{
//     const result = await pool.query("SELECT current_database()");
//     res.send(`the database name is ${result.rows[0].current_database}`)
// })

// middlewares 

app.use(express.json())
app.use(cookieParser())
app.use(cors())
// routes

app.use("/api/user",userRoutes)
app.use("/api/auth",authRoutes)
app.use("/api/station",stationRoutes)
app.use("/api/availability",fuelAvailabilityRoutes)
app.use("/api/feedback",feedbackRoutes)
app.use("/api/favorite",favoriteRoutes)
app.use("/api/price",fuelPriceRoutes)
app.use("/api/comment",commentRoutes)
app.use('/api-docs', basicAuth({
    users: { 'admin': 'password123' },
    challenge: true
  }), swaggerUi.serve, swaggerUiSetup);

// Error handling middleware
app.use(errorHandling)


// Serve static files
app.use('/public', express.static('public'));

setupDatabase();

// server running 
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})