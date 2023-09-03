const OpenAI = require("openai");

const EXPRESSION_BUILDER_PROMPT = "./templates.js";

const openai = new OpenAI({
  apiKey: "", // defaults to process.env["OPENAI_API_KEY"]
});

const generateExpression = async (input, output) => {
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: EXPRESSION_BUILDER_PROMPT },
      {
        role: "user",
        content: `
            Build JSONata expression for below input and output json
            Input JSON:
            \`${JSON.stringify(input, null, 2)}\`
            Output JSON:
            \`${JSON.stringify(output, null, 2)}\`
        `,
      },
    ],
  });
  console.log(response);
  console.log(response.choices[0].message);
  return response.choices[0].message;
};

module.exports = generateExpression;
