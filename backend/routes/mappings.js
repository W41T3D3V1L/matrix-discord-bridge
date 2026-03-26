import express from "express";
import Mapping from "../models/Mapping.js";

const router = express.Router();

// ✅ GET all mappings
router.get("/", async (req, res) => {
  const data = await Mapping.find();
  res.json(data);
});

// ✅ ADD mapping
router.post("/", async (req, res) => {
  const m = await Mapping.create(req.body);
  res.json(m);
});

// 🔥 DELETE mapping (ADD THIS)
router.delete("/:id", async (req, res) => {
  await Mapping.findByIdAndDelete(req.params.id);
  res.json({ success: true });
});

export default router;
