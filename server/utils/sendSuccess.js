const sendSuccess = (res, message, data = null, statusCode = 200) => {
  let resJson = {
    success: true,
    statusCode,
    message,
  };

  if (data) resJson.data = data;

  return res.status(statusCode).json(resJson);
};

export default sendSuccess;
