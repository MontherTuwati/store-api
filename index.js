require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3000;

function normalizeMongoUri(raw) {
  let s = String(raw ?? "").trim();
  if (
    (s.startsWith('"') && s.endsWith('"')) ||
    (s.startsWith("'") && s.endsWith("'"))
  ) {
    s = s.slice(1, -1).trim();
  }
  return s;
}

const uri = normalizeMongoUri(process.env.MONGODB_URI);

if (!uri) {
  console.error("MONGODB_URI is not set.");
  process.exit(1);
}

mongoose
  .connect(uri)
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server listening at http://localhost:${PORT}/`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  });
