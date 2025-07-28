const AppError = require("../utils/app-error");


const errorHandling = (err, req, res, next) => {
  console.log(err);
  console.log(err.name);

  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(400).json({
      status: "failure",
      message: `Duplicate value for : ${field}`,
    });
  }
  if (err.name === "CastError") {
    return res.status(400).json({
      status: "failure",
      message: `invalid Id format`,
    });
  }
  if (err instanceof AppError) {
    return res
      .status(err.statusCode)
      .json({ status: "error", message: err.message });
  }
  if(err.name==="TokenExpiredError")return res
      .status(401)
      .json({ status: "error", message: "invalid token" });
  res.status(500).json({ status: "error", message: "Internal Server Error" });
};

module.exports = {
  errorHandling,
};
