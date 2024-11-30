const User = require("../Models/UserModel");
const Entry = require("../Models/EntrySchema");
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