const catchAsync = require("../utils/catchAsync");

const healthStatus = catchAsync(async (req, res) => {
  res
    .status(200)
    .send({
      services: "BTS.id todo list test",
      message: "API is healthy",
      status: "OK",
      statusCode: 200,
      timestamp: new Date(),
    });
});

module.exports = {
  healthStatus,
};
