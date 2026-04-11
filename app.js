const express = require("express");
const productsRouter = require("./routes/products");

const app = express();
app.use(express.json());

app.get("/getAll", productsRouter.getAllLocal);

app.use("/products", productsRouter);

app.use(express.static("public"));

module.exports = app;
