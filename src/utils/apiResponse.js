exports.successResponse = (res, message, data = null, statusCode = 200) => {
    res.status(statusCode).json({
      success: true,
      message,
      data,
    });
  };
  
  exports.errorResponse = (res, message, statusCode = 400) => {
    res.status(statusCode).json({
      success: false,
      message,
    });
  };