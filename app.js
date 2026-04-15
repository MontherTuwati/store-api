const express = require("express");
const productsRouter = require("./routes/products");

const app = express();
app.use(express.json());

// Assignment endpoint at root.
app.get("/getAll", productsRouter.getAllLocal);

// Product CRUD + integration routes.
app.use("/products", productsRouter);

// Serve frontend files from /public.
app.use(express.static("public"));

module.exports = app;
