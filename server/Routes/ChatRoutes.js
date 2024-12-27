const express = require("express");
const router = express.Router();
const { saveMessage, getMessages } = require("../Controllers/ChatController");
const { validateMessage } = require("../Middlewares/ChatMiddleware");
const { authenticateUser } = require("../Middlewares/AuthMiddleware");

router.post("/messages", authenticateUser, validateMessage, saveMessage);
router.get("/messages", authenticateUser, getMessages);

module.exports = router;