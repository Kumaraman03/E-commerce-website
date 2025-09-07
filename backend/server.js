const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const csv = require("csvtojson");       
const Item = require("./models/Item");  

const authRoutes = require("./routes/auth");
const itemRoutes = require("./routes/items");
const cartRoutes = require("./routes/cart");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
  .then(async () => {
    console.log("MongoDB Connected");

    try {
      const products = await csv().fromFile("./products.csv");

      const mappedProducts = products.map(p => {
        
        const rawPrice = p.Price || p.cost || p.price || "0";

        return {
          name: p.ProductName || p.name || p.Title || "Unknown",
          price: parseFloat(rawPrice) || 0,    
          category: p.Category || p.type || p.category || "General"
        };
      });

      
      await Item.deleteMany({});
      await Item.insertMany(mappedProducts);

      console.log("Products seeded successfully!");
    } catch (err) {
      console.error("Error seeding products:", err.message);
    }
  })
  .catch(err => console.error("MongoDB Connection Error:", err));

app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/cart", cartRoutes);

app.listen(5000, () => console.log("Server running on http://localhost:5000"));
