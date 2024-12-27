const express = require("express");
const router = express.Router();
const { getCurrentlyUsername, checkUser } = require("../Controllers/UserController");
const { authenticateUser } = require("../Middlewares/AuthMiddleware");

// User routes
router.get("/me", authenticateUser, getCurrentlyUsername);
router.post("/check", checkUser);

module.exports = router;