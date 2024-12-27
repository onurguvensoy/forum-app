const User = require("../Models/UserModel");

const getCurrentlyUsername = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    res.status(200).json({ status: true, username: user.username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Error fetching username" });
  }
};

const checkUser = async (req, res) => {
  try {
    const { email, username } = req.body;

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.json({
        exists: true,
        message: "Email already exists",
        field: "email"
      });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.json({
        exists: true,
        message: "Username already taken",
        field: "username"
      });
    }

    return res.json({ exists: false });
  } catch (error) {
    console.error("Error checking user:", error);
    res.status(500).json({
      exists: true,
      message: "Error checking user availability"
    });
  }
};

module.exports = {
  getCurrentlyUsername,
  checkUser
};