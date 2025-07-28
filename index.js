// Load environment variables from .env file
require('dotenv').config()

// Import Express framework
const express = require("express");
// Create an instance of an Express application
const app = express();

// Import user and post route handlers
const usersRouter = require("./routes/users");
const postRouter = require("./routes/posts");

// Import third-party middleware
const morgan = require("morgan"); // Logger for HTTP requests
const cors = require("cors"); // Enable Cross-Origin Resource Sharing

// Import Mongoose for MongoDB connection
const mongoose = require("mongoose");

// Import custom error handling middleware
const { errorHandling } = require('./middlewares/error-handking');

// Import path module to work with file and directory paths
const path = require('path');


// -------------------- Middleware --------------------

// Serve static files from the "uploads" directory
app.use(express.static(path.join(__dirname, "uploads")));

// Parse incoming JSON requests
app.use(express.json());

// Log HTTP requests to the console
app.use(morgan("dev"));

// Enable CORS for all incoming requests
app.use(cors());


// -------------------- Routes --------------------

app.use("/",(req,res)=>{
  res.status(200).json({massage:"server running"})
})

// Mount the user routes on the "/users" path
app.use("/users", usersRouter);

// Mount the post routes on the "/posts" path
app.use("/posts", postRouter);


// -------------------- Error Handling --------------------

// Handle errors using the custom middleware
app.use(errorHandling);


// -------------------- Server Startup --------------------

// Start the server and listen on the specified port


mongoose
  .connect(`${process.env.MONGO_URI}${process.env.db_name}`)
  .then(() => console.log("connected mongoDB")) // Success message
  .catch((err) => console.log("mongoDB connection error:", err)); // Error message

  
// app.listen(process.env.PORT || 3000, () => {
//   console.log(`Example app listening on port ${process.env.PORT || 3000}`);
  
//   // Connect to MongoDB using Mongoose
// });


module.exports=app