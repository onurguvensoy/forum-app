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

app.listen(port, () => {
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


io.on('connection', socket => {
  socket.on('user-connect', async (userData) => {
  	userData.socketId = socket.id;
  	usersArray.push(userData);
  	io.sockets.emit('users-connected', usersArray);

    console.log('Users online: ' + usersArray.length);

    try {
      const messages = await Message.find(); 
      io.sockets.emit('old-messages', messages);
    } catch (err) {
      io.sockets.emit('error', err);
    }
  });

  socket.on('send-message', async (messageData) => {
    try {
      const newMessage = await Message.create(messageData);
      console.log('> ' + messageData.username + ':' + messageData.message);
      io.sockets.emit('new-message', newMessage);
    } catch (err) {
      console.log(err);
      io.sockets.emit('error', err);
    }
  });

  socket.on('disconnect', () => {
  	usersArray.map((user, index) => {
  	  if(usersArray[index].socketId === socket.id)
  	  	return usersArray.splice(index, 1);
  	});

    console.log('Users online: ' + usersArray.length);

  	io.sockets.emit('users-connected', usersArray);
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
