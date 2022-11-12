const sendError = (res, message, statusCode = 400) =>
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });

export default sendError;
