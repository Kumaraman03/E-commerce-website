const express = require("express");
const Item = require("../models/Item"); // MongoDB model
const router = express.Router();

// Create item
router.post("/", async (req, res) => {
  try {
    const item = new Item(req.body);
    await item.save();
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Error creating item" });
  }
});

// Read with filters
router.get("/", async (req, res) => {
  try {
    const { category, minPrice, maxPrice } = req.query;
    let filter = {};

    if (category) filter.category = category;
    if (minPrice && maxPrice) filter.price = { $gte: minPrice, $lte: maxPrice };

    // If no filters applied, return an empty array
    if (Object.keys(filter).length === 0) {
      return res.json([]);
    }

    const items = await Item.find(filter);
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Error fetching items" });
  }
});

module.exports = router;
