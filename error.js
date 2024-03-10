const generateError = (statusCode, errorMessage) => {
    const error = new Error();
    error.statusCode = statusCode;
    error.message = errorMessage;
    return error;
  };
  
  module.exports = { generateError };
  