require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3000;
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("Missing MONGODB_URI in .env");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
