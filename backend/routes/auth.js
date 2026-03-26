import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { CONFIG } from "../config.js";

const router = express.Router();

// REGISTER
router.post("/register", async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);

  const user = await User.create({
    email: req.body.email,
    password: hash
  });

  res.json(user);
});

// LOGIN
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return res.sendStatus(404);

  const valid = await bcrypt.compare(req.body.password, user.password);
  if (!valid) return res.sendStatus(403);

  const token = jwt.sign({ id: user._id }, CONFIG.jwtSecret);

  res.json({ token });
});

export default router;
