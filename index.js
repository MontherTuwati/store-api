require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const productsRouter = require("./routes/products");

const app = express();
app.use(express.json());

// Assignment path GET /getAll (same data as GET /products)
app.get("/getAll", productsRouter.getAllLocal);

app.use("/products", productsRouter);

// Frontend (HTML / CSS / JS) — same origin as API, no CORS needed
app.use(express.static("public"));

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
