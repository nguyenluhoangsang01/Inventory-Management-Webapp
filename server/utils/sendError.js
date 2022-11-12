const sendError = (res, message, statusCode = 400) =>
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  }); // Default statusCode is 400 Bad Request

export default sendError;
