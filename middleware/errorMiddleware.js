const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (error, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("Error handler caught:", error);
  }

  if (res.headersSent) {
    next(error);
    return;
  }

  let statusCode =
    Number.isInteger(error?.statusCode) && error.statusCode >= 400
      ? error.statusCode
      : res.statusCode && res.statusCode !== 200
        ? res.statusCode
        : 500;

  let message =
    typeof error === "string" ? error : error?.message || "Something went wrong";

  // Malformed JSON
  if (error?.name === "SyntaxError" && "body" in error) {
    statusCode = 400;
    message = "Invalid JSON payload";
  }

  // Mongoose invalid ObjectId
  if (error?.name === "CastError" && error?.kind === "ObjectId") {
    statusCode = 400;
    message = "Invalid id";
  }

  // Mongoose schema validation
  if (error?.name === "ValidationError") {
    statusCode = 400;
    const details = Object.values(error.errors || {})
      .map((err) => err.message)
      .filter(Boolean);
    message = details.length ? details.join(", ") : message;
  }

  // Duplicate key error
  if (error?.code === 11000) {
    statusCode = 409;
    message = "Duplicate key error";
  }

  // Multer errors (upload)
  if (error?.name === "MulterError") {
    statusCode = 400;
  }

  // Cloudinary errors often include an http_code
  if (typeof error?.http_code === "number") {
    statusCode = error.http_code;
    message = error?.message || message;
  }

  if (statusCode < 400 || statusCode > 599) {
    statusCode = 500;
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : error?.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
