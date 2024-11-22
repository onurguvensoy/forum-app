const User = require("../Models/UserModel");
require("dotenv").config();
const jwt = require("jsonwebtoken");


module.exports.userVerification = (req, res) => {
  const token = req.cookies.token
  if (!token) {
    return res.json({ status: false })
  }
  jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
    if (err) {
     return res.json({ status: false })
    } else {
      const user = await User.findById(data.id)
      if (user) return res.json({ status: true, user: user.username })
      else return res.json({ status: false })
    }
  })
}

module.exports.authenticateUser = async (req, res, next) => {
  try {
    const token = req.cookies.token;  // Assuming token is stored in cookies

    if (!token) {
      return res.status(401).json({ status: false, message: "No token provided" });
    }

    // Decode the token and get the user ID
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);  // Use the secret key

    // Fetch the user based on the decoded ID from the database
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    // Attach the user object to the request
    req.user = user;
    
    next();  // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Authentication failed" });
  }
};