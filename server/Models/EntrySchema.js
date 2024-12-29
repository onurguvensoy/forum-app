const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Reply content is required"],
    minLength: [1, "Reply content must be at least 1 character long"],
    maxLength: [1000, "Reply content cannot exceed 1000 characters"]
  },
  username: {
    type: String,
    required: [true, "Username is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const entrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    minLength: [5, "Title must be at least 5 characters long"],
    maxLength: [100, "Title cannot exceed 100 characters"]
  },
  content: {
    type: String,
    required: [true, "Content is required"],
    minLength: [20, "Content must be at least 20 characters long"],
    maxLength: [5000, "Content cannot exceed 5000 characters"]
  },
  username: {
    type: String,
    required: [true, "Username is required"]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  viewCount: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  dislikes: {
    type: Number,
    default: 0
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  dislikedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  replies: [replySchema]
});

// Add index for sorting by viewCount
entrySchema.index({ viewCount: -1 });

module.exports = mongoose.model('Entry', entrySchema);