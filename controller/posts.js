// Import the Post model
const Post = require("../models/posts");

// ------------------- CREATE A POST -------------------
const createPost = async (req, res) => {
  const body = req.body;

  // Create a new post and associate it with the logged-in user's ID
  const post = await Post.create({
    ...body,
    userId: req.user._id // Add the user's ID from the authenticated request
  });

  // Respond with success status and the created post
  res.status(201).json({
    status: "success",
    message: "Post created successfully",
    post: post,
  });
};

// ------------------- GET ALL POSTS -------------------
const getPost = async (req, res) => {
  // Find all posts and populate user details (from userId reference)
  const posts = await Post.find().populate('userId');

  // Respond with all posts
  res.status(201).json({
    status: "success",
    message: "get all post successfully",
    post: posts,
  });
};

// Export the post controller functions
module.exports = {
  createPost,
  getPost
};
