const User = require("../Models/UserModel");
const { createSecretToken } = require("../util/SecretToken");
const jwt = require("jsonwebtoken");

// Rename to match the route imports
const login = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    
    if (!identifier || !password) {
      return res.json({ message: 'All fields are required', success: false });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { phoneNumber: identifier }
      ]
    });

    if (!user) {
      return res.json({ message: 'Invalid credentials', success: false });
    }

    const auth = await user.comparePassword(password);
    if (!auth) {
      return res.json({ message: 'Invalid credentials', success: false });
    }

    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000 // 1 day
    });

    res.status(200).json({ 
      message: "Logged in successfully", 
      success: true,
      user: {
        id: user._id,
        username: user.username
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ 
      message: "An error occurred during login", 
      success: false 
    });
  }
};

const signup = async (req, res, next) => {
  try {
    const { email, username, password, phoneNumber } = req.body;
    
    // Check if user already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        message: "Email already exists"
      });
    }

    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({
        success: false,
        message: "Username already exists"
      });
    }

    const phoneExists = await User.findOne({ phoneNumber });
    if (phoneExists) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered"
      });
    }

    // If all checks pass, create new user
    const user = await User.create({ email, username, password, phoneNumber });
    const token = createSecretToken(user._id);
    
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: true,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user
    });
    
  } catch (error) {
    next(error);
  }
};

const verifyUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false });
    }

    // Verify the token
    const verified = jwt.verify(token, process.env.TOKEN_KEY);
    if (!verified) {
      return res.json({ status: false });
    }

    // Check if user still exists in database
    const user = await User.findById(verified.id);
    if (!user) {
      return res.json({ status: false });
    }

    return res.json({ 
      status: true,
      user: {
        id: user._id,
        username: user.username
      }
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return res.json({ status: false });
  }
};

const getUsername = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.json({ status: false });
    }

    const verified = jwt.verify(token, process.env.TOKEN_KEY);
    if (!verified) {
      return res.json({ status: false });
    }

    const user = await User.findById(verified.id);
    if (!user) {
      return res.json({ status: false });
    }

    return res.json({ 
      status: true,
      username: user.username
    });
  } catch (error) {
    console.error("Error fetching username:", error);
    return res.json({ status: false });
  }
};

module.exports = {
  login,
  signup,
  verifyUser,
  getUsername
};