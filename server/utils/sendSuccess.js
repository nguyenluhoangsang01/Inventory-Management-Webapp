const sendSuccess = (res, message, data = null, statusCode = 200) => {
  let resJson = {
    success: true,
    statusCode,
    message,
  };

  if (data) resJson.data = data;

  return res.status(statusCode).json(resJson);
}; // Default statusCode is 200 OK, data is null

export default sendSuccess;
