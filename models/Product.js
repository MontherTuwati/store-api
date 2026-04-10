const mongoose = require("mongoose");

// Assignment fields: storeId, storeName, productId, productName, price
const productSchema = new mongoose.Schema({
  storeId: { type: String, required: true },
  storeName: { type: String, required: true },
  productId: { type: String, required: true },
  productName: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
});

productSchema.index({ storeId: 1, productId: 1 }, { unique: true });

module.exports = mongoose.model("Product", productSchema);
