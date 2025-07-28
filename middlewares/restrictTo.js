// Import the custom AppError class for error handling
const AppError = require("../utils/app-error");

// Middleware factory to restrict access based on user roles
const restrictTo = (...roles) => {
  // Return an Express middleware function
  return (req, res, next) => {
    const user = req.user; // Get the authenticated user from the request

    // Check if the user's role is not in the allowed roles
    if (!roles.includes(user.role)) {
      // If not allowed, throw a "Forbidden" error (HTTP 403)
      throw new AppError("Forbidden", 403);
    }

    // If the user is allowed, continue to the next middleware or handler
    next();
  };
};

// Export the restrictTo middleware for use in route protection
module.exports = restrictTo;
