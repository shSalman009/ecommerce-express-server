// Function for sending success response
const sendSuccessResponse = (
  res,
  data = null,
  message = "Success",
  statusCode = 200
) => {
  const response = {
    success: true,
    message,
    payload: data,
  };
  res.status(statusCode).json(response);
};

// Function for sending error response
const sendErrorResponse = (
  res,
  message = "Internal Server Error",
  statusCode = 500
) => {
  const response = {
    success: false,
    message,
  };
  res.status(statusCode).json(response);
};

module.exports = { sendSuccessResponse, sendErrorResponse };
