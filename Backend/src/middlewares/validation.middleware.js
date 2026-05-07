const validate = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property]);
        if (error) {
            const { details } = error;
            const message = details.map(i => i.message).join(",");
            return res.status(422).json({ error: message });
        }
        next();
    };
};

export const validateRequestBody = (schema) => validate(schema, "body");
export const validateQueryParams = (schema) => validate(schema, "query");
export const validateRouteParams = (schema) => validate(schema, "params");