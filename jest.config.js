/** @type {import("jest").Config} */
module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js"],
  runInBand: true,
  reporters: [
    "default",
    ["<rootDir>/scripts/assignment-reporter.js", {}],
  ],
};
