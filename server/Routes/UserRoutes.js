const express = require("express");
const router = express.Router();
const { getCurrentlyUsername, checkUser, getUserProfile } = require("../Controllers/UserController");
const { authenticateUser } = require("../Middlewares/AuthMiddleware");

// User routes
router.get("/me", authenticateUser, getCurrentlyUsername);
router.post("/check", checkUser);
router.get("/:username", getUserProfile);

module.exports = router;