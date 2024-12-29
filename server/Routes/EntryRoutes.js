const express = require("express");
const router = express.Router();
const { 
  getAllEntries, 
  getTrendingEntries,
  getEntry,
  createEntry,
  likeEntry,
  dislikeEntry,
  addReply,
  getUserEntries,
  getUserReplies,
  searchContent
} = require("../Controllers/EntryController");
const { authenticateUser } = require("../Middlewares/AuthMiddleware");

// Public routes
router.get("/", getAllEntries);
router.get("/search", searchContent);
router.get("/trending", getTrendingEntries);
router.get("/user/:username", getUserEntries);
router.get("/replies/:username", getUserReplies);
router.get("/:id", getEntry);

// Protected routes (require authentication)
router.post("/", authenticateUser, createEntry);
router.post("/:id/like", authenticateUser, likeEntry);
router.post("/:id/dislike", authenticateUser, dislikeEntry);
router.post("/:id/reply", authenticateUser, addReply);

module.exports = router; 