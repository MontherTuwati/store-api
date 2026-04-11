const express = require("express");
const Product = require("../models/Product");
const { loadRemoteStores, normalizeDoc } = require("../services/remoteProducts");

const router = express.Router();

// Shared list handler: assignment "getAll" + list at GET /products
async function getAllLocal(req, res) {
  try {
    const products = await Product.find().sort({ productId: 1 }).lean();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Create 
router.post("/", async (req, res) => {
  try {
    const doc = await Product.create(req.body);
    res.status(201).json(doc);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate storeId + productId" });
    }
    res.status(400).json({ message: err.message });
  }
});

// Get all products for this store only
router.get("/", getAllLocal);

// getAll endpoint full path: GET /products/getAll
router.get("/getAll", getAllLocal);

router.get("/all-stores", async (req, res) => {
  try {
    const local = await Product.find().sort({ productId: 1 }).lean();
    const localNorm = local.map((p) => normalizeDoc(p, "local"));
    const remote = await loadRemoteStores(process.env);

    const all = [...localNorm, ...remote.juanItems, ...remote.mayaItems];
    res.json({
      count: all.length,
      products: all,
      ...(remote.errors.length ? { fetchErrors: remote.errors } : {}),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get one product by Mongo id
router.get("/id/:id", async (req, res) => {
  try {
    const doc = await Product.findById(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get one product by business key productId
router.get("/by-product-id/:productId", async (req, res) => {
  try {
    const q = { productId: req.params.productId };
    if (req.query.storeId) q.storeId = req.query.storeId;
    const doc = await Product.findOne(q);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update by Mongo _id
router.put("/id/:id", async (req, res) => {
  try {
    const doc = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json(doc);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Duplicate storeId + productId" });
    }
    res.status(400).json({ message: err.message });
  }
});

// Delete by Mongo _id
router.delete("/id/:id", async (req, res) => {
  try {
    const doc = await Product.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "Not found" });
    res.json({ deleted: true, id: doc._id });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.getAllLocal = getAllLocal;
module.exports = router;
