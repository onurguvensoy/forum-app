const jwt = require('jsonwebtoken');

exports.validateMessage = (req, res, next) => {
  const { content, username } = req.body;

  if (!content || !username) {
    return res.status(400).json({
      message: "Message content and username are required",
      success: false
    });
  }

  if (content.length > 500) { // Example max length
    return res.status(400).json({
      message: "Message is too long",
      success: false
    });
  }

  next();
};

exports.socketAuth = (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);
    socket.user = decoded;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
};