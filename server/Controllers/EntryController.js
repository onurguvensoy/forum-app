const Entry = require("../Models/EntrySchema");
const User = require("../Models/UserModel");

exports.getCurrentlyUsername = async (req, res) => {
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

exports.getAllEntries = async (req, res) => {
  try {
    const entries = await Entry.find(); 
    res.status(200).json(entries);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching entries" });
  }
};

exports.getCurrentlyEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ message: "Entry not found" });
    }
    res.status(200).json(entry);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching entry" });
  }
};