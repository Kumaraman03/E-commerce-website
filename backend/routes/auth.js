const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const SECRET = "mysecretkey";

// Signup
router.post("/signup", async (req, res) => {
  const user = new User(req.body);
  await user.save();
  res.json({ message: "User created" });
});

// Login
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ userId: user._id }, SECRET);
  res.json({ token });
});

module.exports = router;
