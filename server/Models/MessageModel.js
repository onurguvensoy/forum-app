const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timestamp: { type: String, required: true },
  type: { type: String, enum: ["sent", "received"], required: true },
  username: { type: String, required: false },
});

module.exports = mongoose.model("Message", messageSchema);