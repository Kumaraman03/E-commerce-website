const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  userId: String,
  items: [{ itemId: String, quantity: Number }]
});
module.exports = mongoose.model("Cart", cartSchema);
