
const utils = require("./utils.js")


function generateBlueprint(schema) {
  return Object.keys(schema.methods).map((key) => {
    const methodSchema = schema.methods[key];
    console.log(utils.parsePropertyList("params", methodSchema.params));
    // console.log('summary=', methodSchema.summary)
    // console.log('params=', methodSchema.params)
    // console.log('generated response example=',utils.generateResponseExample(methodSchema.result))
    return {
      id: key.replace(/\./g, "_"),
      name: key,
      summary: methodSchema.summary,
      description: methodSchema.description,
      constraints: methodSchema.constraints,
      tags: methodSchema.tags,
      params: utils.parsePropertyList("params", methodSchema.params),
      result: utils.parsePropertyList("result", methodSchema.result),
      errors: methodSchema.errors,
      requestExample: utils.generateRequestExample(key, methodSchema.params),
      responseExample: utils.generateResponseExample(methodSchema.result),
    };
  });
}

module.exports = generateBlueprint;
