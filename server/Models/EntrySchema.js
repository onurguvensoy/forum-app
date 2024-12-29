const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, "Reply content is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const entrySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
  },
  content: {
    type: String,
    required: [true, "Content is required"],
  },
  username: {
    type: String,
    required: [true, "Username is required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  viewCount: {
    type: Number,
    default: 0,
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
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