import express from "express";
import dotenv from 'dotenv'
import mongoose from "mongoose";
import morgan from "morgan";
import cors from 'cors';

// import routes
import authRoutes from './routes/auth.js'
import eventRoutes from './routes/event.js'

dotenv.config()

const app = express()

app.use(cors());

mongoose
    .connect(process.env.MONGO_URI)
    .then(console.log('connected'))
    .catch((err)=>console.log(err))
    

//middleare 
app.use(morgan("dev"))
app.use(express.json())

//router middleware
app.use('/api/',authRoutes)
app.use('/api/',eventRoutes)


const port = process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`running on ${port}`)
})