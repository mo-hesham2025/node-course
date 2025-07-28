// Import the custom AppError class to handle validation errors
const AppError = require("../utils/app-error");

// Middleware factory function that takes a Joi schema as an argument
const validate = (schema) => {
  // Return an Express middleware function
  return async (req, res, next) => {
    // Validate the request body against the given schema
    const { error } = await schema.validate(req.body);

    // If validation fails, throw a custom error with the message and a 400 status code
    if (error) {
      throw new AppError(error.details[0].message, 400);
    }

    // If validation passes, move to the next middleware or route handler
    next();
  };
};

// Export the validate middleware for use in routes
module.exports = {
  validate
}
