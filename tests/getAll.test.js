const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app");

/**
 * Assignment summary line is printed by scripts/assignment-reporter.js (Jest loads
 * reporters from jest.config.js — they cannot live in this file without breaking Jest).
 */
describe("getAll endpoint", () => {
  beforeAll(async () => {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error("Set MONGODB_URI in .env to run tests");
    }
    await mongoose.connect(uri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  it("getAll to show all product", async () => {
    const res = await request(app).get("/getAll");
    globalThis.__assignmentGetAllHttpStatus = res.status;
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
