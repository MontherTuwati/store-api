/**
 * Inserts 5 sample products for the store.
 * Use npm run seed to run this script.
 */
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Product = require("../models/Product");

const samples = [
  {
    storeId: "S002",
    storeName: "Monther Store",
    productId: "P001",
    productName: "USB-C Hub",
    price: 45.99,
  },
  {
    storeId: "S002",
    storeName: "Monther Store",
    productId: "P002",
    productName: "Webcam HD",
    price: 79.0,
  },
  {
    storeId: "S002",
    storeName: "Monther Store",
    productId: "P003",
    productName: "Desk Lamp LED",
    price: 34.5,
  },
  {
    storeId: "S002",
    storeName: "Monther Store",
    productId: "P004",
    productName: "Mechanical Keyboard",
    price: 129.99,
  },
  {
    storeId: "S002",
    storeName: "Monther Store",
    productId: "P005",
    productName: "Ergonomic Mouse",
    price: 59.99,
  },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Set MONGODB_URI in .env");
    process.exit(1);
  }
  await mongoose.connect(uri);
  await Product.deleteMany({ storeId: "S002", storeName: "Monther Store" });
  const inserted = await Product.insertMany(samples);
  console.log(`Seeded ${inserted.length} products for Monther Store`);
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
