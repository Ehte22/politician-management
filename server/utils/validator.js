const { z } = require("zod");

const generateSchema = (fieldName, rules) => {

    let schema

    if (Array.isArray(rules)) {
        schema = z.array(z.object(generateObjectSchema(rules[0])))
    } else if (rules.checkbox) {
        schema = z.union([
            z.array(z.string()),
            z.array(z.number()),
            z.string(),
        ]);

        if (rules.required) {
            schema = schema.refine((values) => values.length > 0, {
                message: ` ${fieldName} are required`,
            });
        }
    } else if (rules.object) {
        schema = z.object(generateObjectSchema(rules))
    } else {

        if (rules.type === 'number') {
            schema = z
                .union([z.number(), z.string().length(0)])
                .transform((value) => {
                    if (value === "") {
                        return undefined;
                    }
                    const parsedValue = Number(value);
                    if (isNaN(parsedValue)) {
                        throw new Error("Invalid number");
                    }
                    return parsedValue;
                });
        } else {

            schema = z.string()

            if (rules.min) {
                schema = schema.refine((value) => {
                    if (value) {
                        return rules.min && (value.length >= rules.min)
                    } else {
                        return true
                    }
                }, {
                    message: `${fieldName} must be at least ${rules.min} characters`
                })
            }

            if (rules.max) {
                schema = schema.refine((value) => {
                    if (value) {
                        return rules.max && (value.length <= rules.max)
                    } else {
                        return true
                    }
                }, {
                    message: `${fieldName} must be at most ${rules.max} characters`
                })
            }
        }

        if (rules.required) {
            schema = schema.refine(
                (value) => value !== undefined && value !== "",
                { message: `Field is required` }
            );
        } else {
            schema = schema.optional();
        }

        if (rules.email) {
            schema = schema.refine((value) => {
                if (value) {
                    return z.string().email().safeParse(value).success
                } else {
                    return true
                }
            }, {
                message: "Please enter a valid email address"
            })
        }

        if (rules.pattern) {
            schema = schema.refine((value) => {
                if (value) {
                    return rules.pattern && rules.pattern.test(value)
                } else {
                    return true
                }
            }, {
                message: `Invalid format for ${fieldName}`
            })
        }

    }
    return schema;
};

// Helper function to generate schema for object-based fields
const generateObjectSchema = (rules) => {
    const schemaObj = {};

    Object.keys(rules).forEach((key) => {
        if (key !== "object") {
            schemaObj[key] = generateSchema(key, rules[key]);
        }
    });

    return schemaObj;
};


// Custom validator function
exports.customValidator = (data, rules) => {

    const schemaObj = {};

    Object.keys(rules).forEach((key) => {
        schemaObj[key] = generateSchema(key, rules[key]);
    });
    const schema = z.object(schemaObj);

    try {
        schema.parse(data);

        return { isError: false, error: null };
    } catch (e) {
        if (e instanceof z.ZodError) {
            return {
                isError: true,
                error: e.errors.map((err) => {
                    return {
                        path: err.path.length > 1
                            ? err.path.length === 2
                                ? `${err.path[0]}.${err.path[1]}`
                                : ` ${err.path[0]}[${err.path[1]}].${err.path[2]}`
                            : err.path[0],
                        message: err.message,
                    }
                }),
            };
        }
        throw e;
    }
};
