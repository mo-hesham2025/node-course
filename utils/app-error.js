// Define a custom error class that extends the built-in Error class
class AppError extends Error {
    // Constructor takes a message and an HTTP status code
    constructor(message, statusCode) {
        // Call the parent class (Error) constructor with the message
        super(message);

        // Assign the status code to the custom error instance
        this.statusCode = statusCode;

        // Capture the stack trace and exclude the constructor call from it
        Error.captureStackTrace(this, this.constructor);
    }
}

// Export the AppError class so it can be used in other files
module.exports = AppError;
