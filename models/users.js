const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, 
      match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
    password: {
      type: String,
      required: true,
      minlenght: 6,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    photo: {
      type: String,
    },
  },
  { timestamps: true }
);



const User = mongoose.model("User",userSchema)
// await User.createIndex({ email: 1 }, { unique: true });

module.exports = User
