//Standalone test for teammate API (Mayada)


const http = require("http");
const https = require("https");
const { URL } = require("url");

const TEST_NAME = "getAll to show all product";
const email =
  process.env.MAYA_STUDENT_EMAIL || "saou0003@algonquinlive.com";
const target =
  process.env.MAYA_API_URL || "https://mayada-store-api-2.onrender.com/products";

function httpGet(urlString) {
  return new Promise((resolve, reject) => {
    const u = new URL(urlString);
    const lib = u.protocol === "https:" ? https : http;
    const req = lib.request(
      urlString,
      { method: "GET", timeout: 45000 },
      (res) => {
        let body = "";
        res.on("data", (c) => {
          body += c;
        });
        res.on("end", () => resolve({ status: res.statusCode || 0, body }));
      }
    );
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("timeout"));
    });
    req.end();
  });
}

async function main() {
  let status = 0;
  let passed = false;
  try {
    const { status: st, body } = await httpGet(target);
    status = st;
    if (st !== 200) {
      passed = false;
    } else {
      const data = JSON.parse(body);
      passed = Array.isArray(data) && data.length > 0;
    }
  } catch {
    passed = false;
    if (status === 0) status = "ERR";
  }

  const verdict = passed ? "PASSED" : "FAILED";
  const code = passed ? 200 : status;
  console.log(`${email} - ${TEST_NAME} - ${code} - ${verdict}`);
  process.exit(passed ? 0 : 1);
}

main().catch(() => {
  console.log(`${email} - ${TEST_NAME} - ERR - FAILED`);
  process.exit(1);
});
