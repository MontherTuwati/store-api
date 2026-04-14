//Runs standalone Node test scripts in order.

const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");

const TEST_FILES = ["test-getAll.js", "juan-test.js", "mayada-test.js"];

function envFromDotEnv() {
  const fp = path.join(__dirname, ".env");
  if (!fs.existsSync(fp)) return {};
  const out = {};
  const text = fs.readFileSync(fp, "utf8");
  for (const line of text.split(/\r?\n/)) {
    const s = line.trim();
    if (!s || s.startsWith("#")) continue;
    const eq = s.indexOf("=");
    if (eq === -1) continue;
    const key = s.slice(0, eq).trim();
    let val = s.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    out[key] = val;
  }
  return out;
}

function runScript(filename) {
  const fullPath = path.join(__dirname, filename);
  return new Promise((resolve) => {
    if (!fs.existsSync(fullPath)) {
      console.log(`(skipped) ${filename} — file not found`);
      resolve();
      return;
    }

    const child = spawn(process.execPath, [fullPath], {
      cwd: __dirname,
      stdio: "inherit",
      env: { ...process.env, ...envFromDotEnv() },
    });

    child.on("error", (err) => {
      console.error(err);
      resolve();
    });

    child.on("close", () => {
      resolve();
    });
  });
}

async function main() {
  console.log("--- Running Tests ---");
  for (const file of TEST_FILES) {
    await runScript(file);
  }
  console.log("--- All Tests Completed ---");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
