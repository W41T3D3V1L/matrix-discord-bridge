import "dotenv/config";

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

await mongoose.connect(process.env.MONGO_URI);
console.log("✅ Mongo connected");

// 🔥 MODEL
const Mapping = mongoose.model("Mapping", new mongoose.Schema({
  roomId: String,
  channelId: String
}));

// 🔥 ROUTES
app.get("/mappings", async (req, res) => {
  const data = await Mapping.find();
  res.json(data);
});

app.post("/mappings", async (req, res) => {
  const m = await Mapping.create(req.body);
  res.json(m);
});

app.delete("/mappings/:id", async (req, res) => {
  await Mapping.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

// 🔥 AVATAR PROXY (IMPORTANT)
app.get("/avatar/:server/:mediaId", async (req, res) => {
  try {
    const { server, mediaId } = req.params;

    const url = `https://matrix.org/_matrix/media/v3/download/${server}/${mediaId}`;

    const response = await fetch(url);

    if (!response.ok) {
      return res.status(404).send("Not found");
    }

    res.setHeader("Content-Type", response.headers.get("content-type"));

    response.body.pipe(res);

  } catch (err) {
    console.error("Avatar proxy error:", err);
    res.status(500).send("Error");
  }
});

app.listen(process.env.PORT || 3000, () => {
  console.log("🚀 Backend running");
});
