const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [5, "Title must be at least 5 characters long"],
    maxlength: [100, "Title cannot exceed 100 characters"]
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    trim: true,
    minlength: [20, "Content must be at least 20 characters long"],
    maxlength: [5000, "Content cannot exceed 5000 characters"]
  },
  username: {
    type: String,
    required: true,
    ref: 'User'
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  likes: {
    type: Number,
    default: 0
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Entry", entrySchema); 