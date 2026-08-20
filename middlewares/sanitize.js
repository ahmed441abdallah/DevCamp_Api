import sanitize from "mongo-sanitize";

const sanitizeInputs = (req, res, next) => {
    req.body = sanitize(req.body);
    req.params = sanitize(req.params);

    const sanitizedQuery = {};
    for (const key in req.query) {
        sanitizedQuery[key] = sanitize(req.query[key]);
    }

    Object.defineProperty(req, 'query', {
        value: sanitizedQuery,
        writable: true,
        configurable: true,
        enumerable: true,
    });

    next();
};

export default sanitizeInputs;