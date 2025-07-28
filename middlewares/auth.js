// Import jsonwebtoken for working with JWTs
const jwt = require("jsonwebtoken");

// Use Node's util.promisify to convert jwt.verify into a promise-based function
const util = require("util");
const jwtVerify = util.promisify(jwt.verify);

// Import custom error class
const AppError = require("../utils/app-error");

// Import the User model to fetch user data from the database
const User = require("../models/users");

// Authentication middleware to protect routes
const auth = async (req, res, next) => {
  // Get the token from the Authorization header (format: Bearer <token>)
  const token = req.headers.authorization?.split(" ")[1];

  // If no token is provided, throw an unauthorized error
  if (!token) throw new AppError("no token provided", 401);

  // JWT secret used to verify the token (should ideally be in .env file)
  const jwtSecret = process.env.JWT_SECRET;

  // Verify and decode the token to extract the payload
  const payload = await jwtVerify(token, jwtSecret);

  // Find the user in the database using the ID from the token (payload.sub)
  const user = await User.findById(payload.sub);

  // If the user doesn't exist, throw a 404 error
  if (!user) {
    throw new AppError("user not found", 404);
  }

  // Attach the authenticated user object to the request
  req.user = user;

  // Proceed to the next middleware or route handler
  next();
};

// Export the authentication middleware for use in protected routes
module.exports = auth;
