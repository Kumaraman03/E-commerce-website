const express = require("express");
const jwt = require("jsonwebtoken");
const Cart = require("../models/Cart");
const router = express.Router();
const SECRET = "mysecretkey";

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(403).json({ error: "No token" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(401).json({ error: "Invalid token" });
  }
}

// Add to cart
router.post("/add", authMiddleware, async (req, res) => {
  const { itemId } = req.body;
  let cart = await Cart.findOne({ userId: req.user.userId });
  if (!cart) cart = new Cart({ userId: req.user.userId, items: [] });

  const existing = cart.items.find(i => i.itemId === itemId);
  if (existing) existing.quantity += 1;
  else cart.items.push({ itemId, quantity: 1 });

  await cart.save();
  res.json(cart);
});

// Remove item
router.post("/remove", authMiddleware, async (req, res) => {
  const { itemId } = req.body;
  let cart = await Cart.findOne({ userId: req.user.userId });
  if (!cart) return res.json({ message: "Cart empty" });

  cart.items = cart.items.filter(i => i.itemId !== itemId);
  await cart.save();
  res.json(cart);
});

// Get cart
router.get("/", authMiddleware, async (req, res) => {
  const cart = await Cart.findOne({ userId: req.user.userId });
  res.json(cart || { items: [] });
});

module.exports = router;
