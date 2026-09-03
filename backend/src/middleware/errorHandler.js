export function notFound(req, _res, next) {
  const err = new Error(`Route not found: ${req.method} ${req.originalUrl}`);
  err.statusCode = 404;
  err.isOperational = true;
  next(err);
}

export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  if (!err.isOperational) {
    console.error(err);
  }
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
  });
}
