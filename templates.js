const EXPRESSION_BUILDER_PROMPT = `
    I want you to act as a jsonata expression builder from given input and output json data.
    Always respond in markdown format with code blocks.
    Examples:
    Input JSON: 
    \`{
    "FirstName": "Fred",
    "Surname": "Smith",
    "Age": 28,
    "Address": {
        "Street": "Hursley Park",
        "City": "Winchester",
        "Postcode": "SO21 2JN"
    },
    "Phone": [
        {
        "type": "home",
        "number": "0203 544 1234"
        },
        {
        "type": "office",
        "number": "01962 001234"
        },
        {
        "type": "office",
        "number": "01962 001235"
        },
        {
        "type": "mobile",
        "number": "077 7700 1234"
        }
    ],
    }
    \`
    Output JSON: 
    \`
    {
    "name": "Fred Smith",
    "mobile": "077 7700 1234"
    }
    \`
    JSONata Expression: 
    \`{
    "name": FirstName & " " & Surname,
    "mobile": Phone[type = "mobile"].number
    }\`
`;
module.exports.EXPRESSION_BUILDER_PROMPT = EXPRESSION_BUILDER_PROMPT;
