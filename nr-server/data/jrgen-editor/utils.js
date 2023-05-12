const $RefParser = require("json-schema-ref-parser");

normalizeMultiLineString = (multiLineString, separator) => {
  if (!multiLineString) {
    return "";
  }
  if (Array.isArray(multiLineString)) {
    return multiLineString.join(separator || "\n");
  }
  return multiLineString.toString();
};

generateRequestExample = (methodName, paramsSchema) => {
  let example =  {
    jsonrpc: "2.0",
    id: "1234567890",
    method: methodName,
    params: generateExample(paramsSchema),
  }
  //console.log("request example = ",example)
  return JSON.stringify(
    {
      jsonrpc: "2.0",
      id: "1234567890",
      method: methodName,
      params: generateExample(paramsSchema),
    },
    null,
    2
  );
};

generateResponseExample = (resultSchema) => {
  return JSON.stringify(
    {
      jsonrpc: "2.0",
      id: "1234567890",
      result: generateExample(resultSchema),
    },
    null,
    2
  );
};

generateExample = (schema) => {
  console.log('generating example')
  if (!schema) {
   // console.log('generating example: no schema')
    return;
  }

  if (schema.default !== undefined) {
   // console.log('generating example schema.default !== undefined')
    return schema.default;
  }

  if (schema.example !== undefined) {
    return schema.example;
  }

  if (schema.examples !== undefined) {
    return schema.examples[0];
  }

  if (schema.enum !== undefined) {
    return schema.enum;
  }

  if (schema.type === "object") {
    return Object.entries(schema.properties).reduce(
      (accumulator, [propertyKey, propertyValue]) => {
        accumulator[propertyKey] = generateExample(propertyValue);
        return accumulator;
      },
      {}
    );
  }

  if (schema.type === "array") {
    if (Array.isArray(schema.items)) {
      return schema.items.map((item) => generateExample(item));
    } else {
      return [generateExample(schema.items)];
    }
  }

  for (const item of [schema.anyOf, schema.oneOf, schema.allOf]
    .filter((item) => !!item)
    .flat()) {
    const example = generateExample(item);
    
    if (example) {
      
      return example;
      
    }
  }
};

parsePropertyList = (name, schema) => {
  console.log('parsing property')
  if (!schema) {
    return [];
  }

  if (schema.allOf) {
    for (const item of schema.allOf) {
      for (const key of Object.keys(item)) {
        schema[key] = item.key;
      }
    }
  }

  let entries = [];

  entries.push({
    name: name,
    type: schema.type,
    description: schema.description || "",
    constraints: Object.entries({
      minLength: schema.minLength,
      maxLength: schema.maxLength,
      pattern: schema.pattern,
      format: schema.format,
      enum: schema.enum,
      multipleOf: schema.multipleOf,
      minimum: schema.minimum,
      maximum: schema.maximum,
      exclusiveMaximum: schema.exclusiveMaximum,
      exclusiveMinimum: schema.exclusiveMinimum,
      minItems: schema.minItems,
      maxItems: schema.maxItems,
      uniqueItems: schema.uniqueItems,
      minProperties: schema.minProperties,
      maxProperties: schema.maxProperties,
      additionalProperties: schema.additionalProperties,
      propertyNames: schema.propertyNames,
      patternProperties: schema.propertyNames,
      dependencies: schema.dependencies,
      exclusive: schema.exclusive,
    })
      .filter(
        ([constraintName, constraintValue]) => constraintValue !== undefined
      )
      .reduce((accumulator, [constraintName, constraintValue]) => {
        if (typeof constraintValue === "boolean") {
          accumulator.push(constraintName);
        } else {
          accumulator.push(`${constraintName}="${constraintValue}"`);
        }

        return accumulator;
      }, [])
      .join(", "),
    schema: JSON.stringify(schema, null, 2),
    
  });
  //console.log(entries)
  if (schema.type === "array") {
    if (Array.isArray(schema.items)) {
      schema.items.forEach((item, index) => {
        let selector = index;
        if (item.name) {
          selector += ":" + item.name;
        }
        entries = entries.concat(
          parsePropertyList(name + "[" + selector + "]", item)
        );
      });
    } else {
      entries = entries.concat(
        parsePropertyList(name + "[]", schema.items)
      );
    }
  } else if (schema.type === "object") {
    Object.keys(schema.properties).forEach((key) => {
      let connector = "?.";
      if (schema.required && schema.required.includes(key)) {
        connector = ".";
      }
      entries = entries.concat(
        parsePropertyList(
          name + connector + key,
          schema.properties[key]
        )
      );
    });
  }

  if (schema.anyOf) {
    schema.anyOf.forEach((item, index) => {
      entries = entries.concat(
        parsePropertyList(`${name}(${index})`, item)
      );
    });
  }

  if (schema.oneOf) {
    schema.oneOf.forEach((item, index) => {
      item.exclusive = true;
      entries = entries.concat(
        parsePropertyList(`${name}(${index})`, item)
      );
    });
  }

  return entries;
};

resolveSchemaRefs = async (schema) => {
  return new Promise((resolve) => {
    $RefParser.dereference(schema, (error, schema) => {
      if (error) {
        throw error;
      }
      resolve(schema);
    });
  });
};
