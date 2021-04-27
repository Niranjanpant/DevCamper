const ErrorResponse = require("../utils/errorResponse");

//customized middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;
  console.log(err);

  //mongoose bad ObjectId error
  if (err.name === "CastError") {
    const message = `Bootcamp not found ${error.value}`;
    error = new ErrorResponse(message, 404);
  }

  //mongoose duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate field value entered`;
    error = new ErrorResponse(message, 400);
  }

  //mongoose validation error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = new ErrorResponse(message, 400);
  }

  res
    .status(error.statusCode || 500)
    .json({ success: false, error: error.message || "server Error" });
};

module.exports = errorHandler;
