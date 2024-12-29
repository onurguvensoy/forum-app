const jwt = require("jsonwebtoken");
const User = require("../Models/UserModel");

exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ status: false, message: "No token provided" });
    }

    // Clean the token if it comes with 'Bearer ' prefix
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;

    const decoded = jwt.verify(cleanToken, process.env.TOKEN_KEY);  

    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    req.user = user;
    next(); 
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ status: false, message: "Authentication failed" });
  }
};

exports.verifyToken = (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.json({ status: false });
  }
  
  try {
    // Clean the token if it comes with 'Bearer ' prefix
    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token;
    
    const decoded = jwt.verify(cleanToken, process.env.TOKEN_KEY);
    User.findById(decoded.id)
      .then(user => {
        if (user) {
          return res.json({ status: true, user: user.username });
        }
        return res.json({ status: false });
      })
      .catch(err => {
        console.error("Token verification error:", err);
        return res.json({ status: false });
      });
  } catch (err) {
    console.error("Token verification error:", err);
    return res.json({ status: false });
  }
};