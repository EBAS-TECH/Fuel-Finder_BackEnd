import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db.js";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js"
import errorHandling from "./middlewares/errorHandler.js";
import createUserTable from "./data/createUserTable.js";

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

// Error handling middleware
app.use(errorHandling)

// create tables

createUserTable();

// server running 
app.listen(port,()=>{
    console.log(`Server is running on port ${port}`)
})