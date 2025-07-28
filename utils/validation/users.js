// Import Joi for schema validation
const Joi = require("joi");

// Schema for validating user signup data
const signupSchema = Joi.object({
  name: Joi.string().required(), // Name is required and must be a string
  email: Joi.string().email().required(), // Email is required and must be valid
  password: Joi.string().min(6).required(), // Password must be at least 6 characters
  confirmPassword: Joi.string().required().valid(Joi.ref('password')) // Must match the password field
});

// Schema for validating user login data
const loginSchema = Joi.object({
  email: Joi.string().email().required(), // Email is required and must be valid
  password: Joi.string().min(6).required(), // Password must be at least 6 characters
});

// Schema for creating a new user (typically by an admin)
const createUserSchema = Joi.object({
  name: Joi.string().required(), // Name is required
  email: Joi.string().email().required(), // Valid email required
  password: Joi.string().min(6).required(), // Password with min 6 characters
  role: Joi.string() // Optional role field (e.g., 'admin', 'user')
});

// Schema for updating a user — makes all fields optional
const updateUserSchema = createUserSchema.fork(
  ['name', 'email', 'password', 'role'], 
  (schema) => schema.optional() // Make each specified field optional for update
);

// Export all the schemas to be used in other parts of the application
module.exports = {
  createUserSchema,
  updateUserSchema,
  signupSchema,
  loginSchema 
}
