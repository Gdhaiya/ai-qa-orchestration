require("dotenv").config();
const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateTestCases(summary, description) {
  const prompt = `
You are a QA engineer.

Generate FUNCTIONAL test cases from the ticket.

Return ONLY valid JSON.

Do NOT include markdown.
Do NOT include explanation.

Return format:
[
 { "title": "", "steps": [], "expected_result": "" }
]

Ticket Summary:
${summary}

Description:
${description}
`;

  const response = await client.chat.completions.create({
    model: "gpt-4.1",
    messages: [{ role: "user", content: prompt }],
  });

  return JSON.parse(response.choices[0].message.content);
}

module.exports = generateTestCases;
