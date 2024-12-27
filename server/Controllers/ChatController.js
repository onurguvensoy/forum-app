const Message = require("../Models/MessageModel");

exports.saveMessage = async (req, res) => {
  try {
    const { content, timestamp, username } = req.body;

    const newMessage = await Message.create({ 
      content, 
      timestamp, 
      username 
    });

    res.status(201).json({
      message: "Message saved successfully",
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ 
      message: "Internal server error", 
      success: false 
    });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ 
      message: "Error fetching messages",
      success: false 
    });
  }
};

exports.handleUserConnect = async (socket, userData, usersArray, io) => {
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
};

exports.handleDisconnect = (socket, usersArray, io) => {
  usersArray = usersArray.filter(user => user.socketId !== socket.id);
  console.log('Users online: ' + usersArray.length);
  io.sockets.emit('users-connected', usersArray);
  return usersArray;
};