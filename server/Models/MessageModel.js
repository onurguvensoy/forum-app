const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timestamp: { type: String, required: true },
  username: { type: String, required: true },
});

module.exports = mongoose.model("Message", messageSchema);