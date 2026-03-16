const axios = require("axios");

async function createBrowserstackTestCase(testCase, issueKey) {
  const projectIdentifier = process.env.BROWSERSTACK_PROJECT_ID;
  const folderId = process.env.BROWSERSTACK_FOLDER_ID;
  const url = `https://test-management.browserstack.com/api/v2/projects/${projectIdentifier}/folders/${folderId}/test-cases`;

  const payload = {
    test_case: {
      name: testCase.title,
      description: `Auto generated from Jira ticket ${issueKey}`,
      template: "test_case_steps",
      // Switch to the direct array (no _attributes)
      // Switch keys to 'step' and 'result'
      test_case_steps: testCase.steps.map((stepText) => ({
        step: stepText,
        result: testCase.expected_result,
      })),
    },
  };

  try {
    const response = await axios.post(url, payload, {
      auth: {
        username: process.env.BROWSERSTACK_USERNAME,
        password: process.env.BROWSERSTACK_ACCESS_KEY,
      },
      headers: { "Content-Type": "application/json" },
    });
    
    return response.data;
  } catch (error) {
    console.error("❌ Error Status:", error.response?.status);
    console.error("❌ Error Data:", error.response?.data);
    throw error;
  }
}

module.exports = createBrowserstackTestCase;
