require("dotenv").config;
const express = require("express");
const generateTestCases = require("./services/testCaseGenerator");
const createBrowserstackTestCase = require("./services/browserstackService");

const app = express();
app.use(express.json());

app.get("/webhook/jira", (req, res) => {
  res.status(200).send("Webhook endpoint is live");
});

app.post("/webhook/jira", async (req, res) => {
  try {
    const issue = req.body.issue;
    const changelog = req.body.changelog;

    if (!issue) {
      return res.status(200).send("No issue data");
    }

    console.log("Issue:", issue.key);

    if (changelog && changelog.items) {
      const statusChange = changelog.items.find(
        (item) => item.field === "status" && item.toString === "Ready for QA",
      );

      if (statusChange) {
        console.log("🔥 Status moved to Ready for QA");

        const summary = issue.fields.summary;
        const description = issue.fields.description;

        console.log("Issue Key:", issue.key);
        console.log("Summary:", summary);
        console.log("Description:", description);
        console.log("Generating test cases...");

        const testCases = await generateTestCases(summary, description);

        console.log("Generated Test Cases:", testCases);

        for (const tc of testCases) {
          try {
            const result = await createBrowserstackTestCase(tc, issue.key);
            console.log("Created Test Case:", result);
          } catch (err) {
            console.error(
              "BrowserStack error:",
              err.response?.data || err.message,
            );
          }
        }
      }
    }
    res.status(200).send("OK");
  } catch (error) {
    console.error("BrowserStack error:", err.response?.data || err.message);
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
