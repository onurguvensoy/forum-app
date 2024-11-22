const mongoose = require('mongoose');

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
        default: new Date(),
      },
});


module.exports = mongoose.model('Entry', entrySchema);