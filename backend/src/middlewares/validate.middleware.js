/**
 * Validates req[source] against a Zod schema.
 * - body: parsed result replaces req.body
 * - query/params: parsed result is stored in req.valid[source]
 *   (req.query is read-only in Express 5)
 */
export const validate =
    (schema, source = "body") =>
        (req, res, next) => {
            const parsed = schema.parse(req[source]);
            if (source === "body") {
                req.body = parsed;
            } else {
                req.valid = { ...req.valid, [source]: parsed };
            }
            next();
        };