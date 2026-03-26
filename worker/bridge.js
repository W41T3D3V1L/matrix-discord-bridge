import "dotenv/config"; // 🔥 load .env

import { discord, setupDiscord } from "./discord.js";
import { matrixClient, startMatrix } from "./matrix.js";
import "./database.js"; // ensure DB connects
import { CONFIG } from "./config.js";

async function start() {
  await startMatrix();

  setupDiscord(matrixClient);

  await discord.login(CONFIG.discordToken);

  console.log("🔥 Worker Bridge running");
}

start();
