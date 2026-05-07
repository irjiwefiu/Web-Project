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

const validation = {
  validateRequestBody: (schema) => validate(schema, "body"),
  validateQueryParams: (schema) => validate(schema, "query"),
  validateRouteParams: (schema) => validate(schema, "params"),
};

export default validation;