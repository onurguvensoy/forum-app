const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoute = require("./Routes/AuthRoute");
const { Server } = require("socket.io");
const http = require("http");
require("dotenv").config();

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

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});


app.use(
  cors({
    origin: "http://localhost:3000", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use("/", authRoute);


io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);


  socket.on("message", (data) => {
    console.log("Message received:", data);
  
    socket.broadcast.emit("message", data);
  });


  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
  });
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
