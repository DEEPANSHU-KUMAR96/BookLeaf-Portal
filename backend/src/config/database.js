import mongoose from "mongoose";
import {config} from '../config/config.js';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(config.MONGO_URI);
        console.log('MongoDB Connected');
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};
