const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUI = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

const generateExpression = require("./openapi-service");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.post("/jsonata/expression", async (req, res) => {
  const { input, output } = req.body;
  if (!input || !output) {
    res.status(400).send("Missing input or output");
  }
  try {
    const expression = await generateExpression(input, output);
    console.log(expression);
    // If its false then retry with openai again
    if (expression === false) {
      res.status(500).send("Error while building expression");
    } else {
      res.write(expression);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send("Error while building expression");
  }
});

//initialize the app.
async function initialize() {
  app.listen(PORT);
}

initialize().finally(() => console.log(`app started on port:${PORT}`));
