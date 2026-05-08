const validateRequestBody = (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(422).json({ error: "Request body is required." });
    }
    next();
};

const validateQueryParams = (req, res, next) => {
    if (!req.query || Object.keys(req.query).length === 0) {
        return res.status(422).json({ error: "Query parameters are required." });
    }
    next();
};

const validateRouteParams = (req, res, next) => {
    if (!req.params || Object.keys(req.params).length === 0) {
        return res.status(422).json({ error: "Route parameters are required." });
    }
    next();
};

export { validateRequestBody, validateQueryParams, validateRouteParams };