import { MongoClient } from "mongodb";
import { CONFIG } from "./config.js";

const client = new MongoClient(CONFIG.mongoUri);

await client.connect();

export const db = client.db("bridge");
export const mappings = db.collection("mappings");

console.log("✅ Worker DB connected");
