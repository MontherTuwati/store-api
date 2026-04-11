require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 3000;

/** Trim whitespace and strip wrapping quotes (common when pasting into host env UIs). */
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

/** Returns SRV hostname from connection string (no credentials). */
function mongoHostFromUri(connectionString) {
  const match = String(connectionString).match(/@([^/?#]+)/);
  return match ? match[1] : "(unparseable URI)";
}

const mongoHost = mongoHostFromUri(uri);
if (uri.includes("USER:PASS") || uri.includes("<password>")) {
  console.error("MONGODB_URI contains unresolved placeholder credentials.");
}
if (mongoHost === "cluster.mongodb.net") {
  console.error(
    "MongoDB hostname is a template value; expected cluster subdomain from Atlas (e.g. cluster0.xxxxx.mongodb.net)."
  );
}
console.log("MongoDB host:", mongoHost);

mongoose
  .connect(uri, {
    serverSelectionTimeoutMS: 30000,
    // Prefer IPv4; some platforms resolve SRV to IPv6 routes that fail from the host network.
    family: 4,
  })
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    console.error(
      "Atlas: allow 0.0.0.0/0 in Network Access. Host env: MONGODB_URI must match Atlas connection string; URL-encode special characters in the password. Verify database user in Database Access."
    );
    process.exit(1);
  });
