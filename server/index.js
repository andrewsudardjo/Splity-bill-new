import express from "express";
import groupRoutes from './routes/groupRoutes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import expenseRoutes from './routes/expenseRoutes.js';
dotenv.config();

const port = 3000;
const app = express();

app.use(express.json());
app.use(cors());

//routessnpm 
app.use('/group', groupRoutes);
app.use('/expense', expenseRoutes);

const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
.then(() => console.log("Connected to MongoDB", mongoURI))
.catch((err) => console.error("MongoDB connection error:", err));

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})