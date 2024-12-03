const User = require("../Models/UserModel");
const Entry = require("../Models/EntrySchema");
const Message = require("../Models/MessageModel");
const { createSecretToken } = require("../util/SecretToken");
const bcrypt = require("bcryptjs");


module.exports.Login = async (req, res, next) => {
    try {
      const { email, password } = req.body;
      if(!email || !password ){
        return res.json({message:'All fields are required'})
      }
      const user = await User.findOne({ email });
      if(!user){
        return res.json({message:'Incorrect password or email' }) 
      }
      const auth = await bcrypt.compare(password,user.password)
      if (!auth) {
        return res.json({message:'Incorrect password or email' }) 
      }
       const token = createSecretToken(user._id);
       res.cookie("token", token, {
         withCredentials: true,
         httpOnly: false,
       });
       res.status(201).json({ message: "User logged in successfully", success: true });
       next()
    } catch (error) {
      console.error(error);
    }
  }

module.exports.Signup = async (req, res, next) => {
  try {
    const { email, password, username, createdAt } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "User already exists" });
    }
    const user = await User.create({ email, password, username, createdAt });
    const token = createSecretToken(user._id);
    res.cookie("token", token, {
      withCredentials: true,
      httpOnly: false,
    });
    res
      .status(201)
      .json({ message: "User signed in successfully", success: true, user });
    next();
  } catch (error) {
    console.error(error);
  }
};

module.exports.Entry = async (req, res, next) => {
  try {
    const { title, content, username, createdAt } = req.body;
    const entry = await Entry.create({ title, content, username, createdAt });
    res.status(201).json({ message: "Entry created successfully", success: true, entry });
    next();
  } catch (error) {
    console.error(error);
  }
};
module.exports.getAllEntries = async (req, res, next) => {
  try {
    const entries = await Entry.find(); 
    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching entries" });
  }
};

module.exports.getCurrentlyUsername = async (req, res) => {
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

module.exports.saveMessages = async (req, res, next) => {
  try {
    const { content, timestamp, username} = req.body;

    const newMessage = await Message.create({ content, timestamp, username});
    res.status(201).json({
      message: "Message saved successfully",
      success: true,
      data: newMessage,
    });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

module.exports.getMessages = async (req, res, next) => {
  try {
    const messages = await Message.find(); 
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getCurrentlyEntry = async (req, res) => {
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json(entry);

}