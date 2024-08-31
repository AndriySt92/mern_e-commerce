import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './db/connectDB';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
connectDB();

export default app;