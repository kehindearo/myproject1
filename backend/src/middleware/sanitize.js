function stripOperators(value) {
  if (Array.isArray(value)) {
    return value.map(stripOperators);
  }
  if (value && typeof value === "object") {
    const clean = {};
    for (const [key, val] of Object.entries(value)) {
      if (key.startsWith("$") || key.includes(".")) continue;
      clean[key] = stripOperators(val);
    }
    return clean;
  }
  return value;
}

/**
 * Recursively strips MongoDB operator keys ($gt, $where, dotted paths, …)
 * from req.body/params. Deliberately skips req.query — Express 5 exposes
 * it as a getter-only property that express-mongo-sanitize's in-place
 * mutation breaks; query values are never interpolated into Mongo
 * operators in this codebase, only used for filtering via Mongoose casts.
 */
export function sanitizeInput(req, _res, next) {
  if (req.body && typeof req.body === "object") {
    req.body = stripOperators(req.body);
  }
  if (req.params && typeof req.params === "object") {
    req.params = stripOperators(req.params);
  }
  next();
}
