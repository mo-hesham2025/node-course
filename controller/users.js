// Import custom error class
const AppError = require("../utils/app-error");

// Import User model from Mongoose
const User = require("../models/users");

// Import bcrypt for password hashing and comparison
const bcrypt = require("bcrypt");

// Import JSON Web Token for authentication
const jwt = require("jsonwebtoken");

// Import util for promisifying jwt.sign
const util = require("util");

// Import crypto (used optionally for generating random tokens or keys)
const crypto = require("crypto");

// Promisify jwt.sign to use async/await instead of callback
const jwtSign = util.promisify(jwt.sign);

// ------------------- SIGNUP -------------------
const signup = async (req, res) => {
  const body = req.body;

  // Hash the user's password before saving
  const hashedPassword = await bcrypt.hash(req.body.password, 10);

  // Create a new user in the database with the hashed password
  const user = await User.create({ ...body, password: hashedPassword });

  // Send success response
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    user: user,
  });
};

// ------------------- LOGIN -------------------
const login = async (req, res) => {
  const body = req.body;

  // Find the user by email
  const user = await User.findOne({ email: body.email });
  if (!user) {
    throw new AppError("email or password wrong", 400);
  }

  // Compare provided password with hashed password in DB
  const isPasswordCorrect = await bcrypt.compare(body.password, user.password);
  if (!isPasswordCorrect) {
    throw new AppError("email or password wrong", 400);
  }

  // JWT secret (should ideally be in .env)
  const jwtSecret = process.env.JWT_SECRET;

  // Generate JWT token for authenticated user
  const access_token = await jwtSign(
    { sub: user._id, name: user.name },
    jwtSecret,
    { expiresIn: "1d" } // Token expires in 1 day
  );

  // Send success response with token
  res.status(201).json({
    status: "success",
    data: { access_token },
  });
};

// ------------------- CREATE USER (Admin) -------------------
const createUser = async (req, res) => {
  const body = req.body;

  // If an image was uploaded and URL exists, attach it to the user
  if (req.imageUrls) {
    body.photo = req.imageUrls[0];
  }

  // Create a new user in DB
  const user = await User.create(body);

  res.status(201).json({
    status: "success",
    message: "User created successfully",
    user: user,
  });
};

// ------------------- GET ALL USERS -------------------
const getAllUsers = async (req, res, next) => {
  // Fetch users based on query parameters
  const users = await User.find(req.query);

  res.status(200).json({ status: "success", users });
};

// ------------------- GET USER BY ID -------------------
const getUserById = async (req, res) => {
  const id = req.params.id;

  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({ status: "success", message: { user } });
};

// ------------------- GET USER BY EMAIL -------------------
const getUserByEmail = async (req, res) => {
  const { email } = req.query;

  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({ status: "success", message: { user } });
};

// ------------------- UPDATE USER (PATCH) -------------------
const updateUserPatch = async (req, res) => {
  const id = req.params.id;
  const body = req.body;

  // Update only provided fields
  const user = await User.findByIdAndUpdate(id, body, { new: true });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    user,
  });
};

// ------------------- UPDATE USER (PUT — MOCK ONLY) -------------------
// Note: This one seems based on a fake file system or memory array (not MongoDB)
const updateUserPut = async (req, res) => {
  const id = parseInt(req.params.id);
  const body = req.body;

  if (!body) {
    res.status(400).json({ status: "faild", message: "Please provide user data" });
    return;
  }

  // Example logic: assumes `getUsers` and `writeData` are defined somewhere
  const users = await getUsers(); // ← Not defined in this file
  const userIndex = users.findIndex((user) => user.id === id);

  if (userIndex === -1) {
    res.status(404).json({ status: "faild", message: "User not found" });
    return;
  }

  users[userIndex] = body;
  await writeData(users); // ← Also not defined here

  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    user: users[userIndex],
  });
};

// ------------------- DELETE USER -------------------
const deleteUser = async (req, res) => {
  const id = req.params.id;

  await User.findByIdAndDelete(id);

  res.status(200).json({
    status: "success",
    message: "User deleted successfully"
  });
};

// ------------------- EXPORT CONTROLLERS -------------------
module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUserPatch,
  updateUserPut,
  deleteUser,
  getUserByEmail,
  signup,
  login,
};
