import express from "express";
import dotenv from 'dotenv'
import { errorHandler } from "./middlewares/errorHandler";
import cookieParser from 'cookie-parser'
import cors from 'cors'
// Routes import
import userRoutes from './routes/user.routes'
import authRoutes from './routes/auth.routes'
import projectsRoutes from './routes/project.routes'

// Initialisations
dotenv.config()
const port = process.env.PORT || 3000
const app = express();

app.use(express.json())
app.use(express.urlencoded({extended : false}))
app.use(cookieParser());

app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? "https : //my.frontendEndpoint" : " http://localhost:3000", 
  credentials: true
}))


app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/projects",projectsRoutes);



app.use(errorHandler);

app.listen(port , ()=> console.log(`Server running on port ${port}`))

