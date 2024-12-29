const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();

// Import routes
const authRoutes = require("./Routes/AuthRoute");
const userRoutes = require("./Routes/UserRoutes");
const entryRoutes = require("./Routes/EntryRoutes");
const chatRoutes = require("./Routes/ChatRoutes");

// Import socket handlers
const { handleUserConnect, handleDisconnect } = require("./Controllers/ChatController");
const { socketAuth } = require("./Middlewares/ChatMiddleware");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  },
});

const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

mongoose
  .connect(process.env.MONGO_URL, {})
  .then(() => console.log("MongoDB is connected successfully"))
  .catch((err) => console.error(err));

// Middleware
app.use(
  cors({
    origin: "https://forum-app-frontend-om3r.onrender.com/", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// Apply routes
app.use("/api/auth", authRoutes);      // /api/auth/login, /api/auth/signup, /api/auth/verify
app.use("/api/users", userRoutes);     // /api/users/me, /api/users/check
app.use("/api/entries", entryRoutes);  // /api/entries, /api/entries/:id
app.use("/api/chat", chatRoutes);      // /api/chat/messages

// Initialize users array
let usersArray = [];

// Socket.IO connection handling
io.use(socketAuth);

io.on('connection', socket => {
  socket.on('user-connect', async (userData) => {
    await handleUserConnect(socket, userData, usersArray, io);
  });

  socket.on('send-message', async (messageData) => {
    try {
      const newMessage = await Message.create(messageData);
      io.sockets.emit('new-message', newMessage);
    } catch (err) {
      socket.emit('error', err);
    }
  });

  socket.on('disconnect', () => {
    usersArray = handleDisconnect(socket, usersArray, io);
  });
});

// Start server
server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

function normalizePort(val) {
  const port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}
