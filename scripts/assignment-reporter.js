/**
 * Prints one line per test: email - testName - HTTP status - PASSED|FAILED
 * (Assignment format; HTTP code is 200 when passed, else last recorded status from test.)
 */

class AssignmentReporter {
  onRunComplete(_contexts, results) {
    const email = process.env.STUDENT_EMAIL || "monthertuwati@gmail.com";

    for (const file of results.testResults) {
      for (const tr of file.testResults) {
        if (tr.status === "pending") continue;
        const passed = tr.status === "passed";
        const code = passed ? 200 : globalThis.__assignmentGetAllHttpStatus ?? "ERR";
        const verdict = passed ? "PASSED" : "FAILED";
        process.stdout.write(`${email} - ${tr.title} - ${code} - ${verdict}\n`);
      }
    }
  }
}

module.exports = AssignmentReporter;
