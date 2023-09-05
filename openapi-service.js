const OpenAI = require("openai");
const toJsonSchema = require("to-json-schema");
const jsonata = require("jsonata");
const express = require("express");

const EXPRESSION_BUILDER_PROMPT = "./templates.js";

const openai = new OpenAI({
  apiKey: "", // defaults to process.env["OPENAI_API_KEY"]
});

const validateJSONataExpression = async (expression, input, output) => {
  const _expression = jsonata(expression);
  const result = await _expression.evaluate(input);
  console.log(result);
  return result;
};

const extractJsonataExpression = (message) => {
  console.log("message", message);
  let indexString = "```";
  let skipCount = 3;
  if (message.indexOf("```json") !== -1) {
    indexString = "```json";
    skipCount = 7;
  }
  if (message.indexOf("```jsonata") !== -1) {
    indexString = "```jsonata";
    skipCount = 10;
  }
  console.log("indexString", indexString);
  console.log("skipCount", skipCount);
  const expression = message.substring(
    message.indexOf(indexString) + skipCount,
    message.lastIndexOf("```")
  );
  console.log("expression", expression);
  return expression;
};
const generateExpression = async (input, output) => {
  const outputJsonSchema = toJsonSchema(output);
  console.log(outputJsonSchema);
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      { role: "system", content: EXPRESSION_BUILDER_PROMPT },
      {
        role: "user",
        content: `
            Build JSONata expression for below input and output json. 
            Input JSON:
            \`${JSON.stringify(input, null, 2)}\`
            Output JSON:
            \`${JSON.stringify(output, null, 2)}\`
        `,
      },
    ],
    // functions: [{ name: "transform_to_json", parameters: outputJsonSchema }],
    // function_call: { name: "transform_to_json" },
  });
  console.log(response);
  console.log(response.choices[0].message);
  const jsonataExpression = extractJsonataExpression(
    response.choices[0].message?.content ?? ""
  );
  //const jsonataExpression = response?.choices[0]?.message?.function_call?.arguments ?? "";
  console.log(jsonataExpression);
  const isValidExpression = await validateJSONataExpression(
    jsonataExpression,
    input,
    output
  );
  if (isValidExpression) {
    return jsonataExpression;
  }
  return {};
};

module.exports = generateExpression;
