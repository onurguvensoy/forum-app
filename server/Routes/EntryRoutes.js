const express = require("express");
const router = express.Router();
const { getAllEntries, getCurrentlyEntry } = require("../Controllers/EntryController");
const { authenticateUser } = require("../Middlewares/AuthMiddleware");

// Entry routes
router.get("/", getAllEntries);
router.get("/:id", getCurrentlyEntry);

module.exports = router; 