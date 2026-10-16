/** Validates req.body against a Zod schema. Errors are handled by errorHandler (400). */
export const validate = (schema) => (req, res, next) => {
    req.body = schema.parse(req.body);
    next();
};