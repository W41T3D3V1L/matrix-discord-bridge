import mongoose from "mongoose";
import { CONFIG } from "./config.js";

await mongoose.connect(CONFIG.mongo);

console.log("✅ MongoDB connected");
