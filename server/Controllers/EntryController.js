const Entry = require("../Models/EntrySchema");

// Get all entries with basic info
const getAllEntries = async (req, res) => {
  try {
    const entries = await Entry.find()
      .select('title content username createdAt viewCount likes dislikes likedBy dislikedBy replies')
      .sort({ createdAt: -1 });

    // Add user's interaction state if authenticated
    const userId = req.user ? req.user._id.toString() : null;
    const entriesWithState = entries.map(entry => ({
      ...entry.toObject(),
      hasLiked: userId ? entry.likedBy.includes(userId) : false,
      hasDisliked: userId ? entry.dislikedBy.includes(userId) : false
    }));

    res.json(entriesWithState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get trending entries
const getTrendingEntries = async (req, res) => {
  try {
    const entries = await Entry.find()
      .select('title username viewCount likes dislikes likedBy dislikedBy')
      .sort({ viewCount: -1, likes: -1 })
      .limit(10);

    // Add user's interaction state if authenticated
    const userId = req.user ? req.user._id.toString() : null;
    const entriesWithState = entries.map(entry => ({
      ...entry.toObject(),
      hasLiked: userId ? entry.likedBy.includes(userId) : false,
      hasDisliked: userId ? entry.dislikedBy.includes(userId) : false
    }));

    res.json(entriesWithState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single entry with full details
const getEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    // Include user ID in response if user is authenticated
    const userId = req.user ? req.user._id.toString() : null;

    // Only increment view count when getting full entry details
    if (req.query.view === 'true') {
      entry.viewCount = (entry.viewCount || 0) + 1;
      await entry.save();
    }

    const entryWithState = {
      ...entry.toObject(),
      hasLiked: userId ? entry.likedBy.includes(userId) : false,
      hasDisliked: userId ? entry.dislikedBy.includes(userId) : false,
      userId
    };

    res.json(entryWithState);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new entry
const createEntry = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required" });
    }

    const newEntry = await Entry.create({
      title,
      content,
      username: req.user.username,
      viewCount: 0,
      likes: 0,
      dislikes: 0,
      likedBy: [],
      dislikedBy: []
    });

    res.status(201).json({
      success: true,
      message: "Entry created successfully",
      entry: newEntry
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like an entry
const likeEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    const userId = req.user._id.toString();

    // Check if user has already liked or disliked
    const hasLiked = entry.likedBy.includes(userId);
    const hasDisliked = entry.dislikedBy.includes(userId);

    // If already liked, remove the like (toggle off)
    if (hasLiked) {
      entry.likedBy = entry.likedBy.filter(id => id !== userId);
      entry.likes = Math.max(0, entry.likes - 1);
      
      await entry.save();
      return res.json({ 
        success: true, 
        likes: entry.likes,
        dislikes: entry.dislikes,
        hasLiked: false,
        hasDisliked: false
      });
    }

    // If disliked, switch to like
    if (hasDisliked) {
      entry.dislikedBy = entry.dislikedBy.filter(id => id !== userId);
      entry.dislikes = Math.max(0, entry.dislikes - 1);
      entry.likedBy.push(userId);
      entry.likes += 1;
    } else {
      // Just add like
      entry.likedBy.push(userId);
      entry.likes += 1;
    }

    await entry.save();
    res.json({ 
      success: true, 
      likes: entry.likes,
      dislikes: entry.dislikes,
      hasLiked: true,
      hasDisliked: false
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Dislike an entry
const dislikeEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    const userId = req.user._id.toString();

    // Check if user has already liked or disliked
    const hasLiked = entry.likedBy.includes(userId);
    const hasDisliked = entry.dislikedBy.includes(userId);

    // If already disliked, remove the dislike (toggle off)
    if (hasDisliked) {
      entry.dislikedBy = entry.dislikedBy.filter(id => id !== userId);
      entry.dislikes = Math.max(0, entry.dislikes - 1);
      
      await entry.save();
      return res.json({ 
        success: true, 
        likes: entry.likes,
        dislikes: entry.dislikes,
        hasLiked: false,
        hasDisliked: false
      });
    }

    // If liked, switch to dislike
    if (hasLiked) {
      entry.likedBy = entry.likedBy.filter(id => id !== userId);
      entry.likes = Math.max(0, entry.likes - 1);
      entry.dislikedBy.push(userId);
      entry.dislikes += 1;
    } else {
      // Just add dislike
      entry.dislikedBy.push(userId);
      entry.dislikes += 1;
    }

    await entry.save();
    res.json({ 
      success: true, 
      likes: entry.likes,
      dislikes: entry.dislikes,
      hasLiked: false,
      hasDisliked: true
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add a reply to an entry
const addReply = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    if (!entry) {
      return res.status(404).json({ error: "Entry not found" });
    }

    const { content } = req.body;
    if (!content || !content.trim()) {
      return res.status(400).json({ error: "Reply content is required" });
    }

    if (content.length < 1 || content.length > 1000) {
      return res.status(400).json({ 
        error: "Reply content must be between 1 and 1000 characters" 
      });
    }

    const reply = {
      content: content.trim(),
      username: req.user.username,
      createdAt: new Date()
    };

    entry.replies.push(reply);
    await entry.save();

    res.json({
      success: true,
      message: "Reply added successfully",
      reply
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllEntries,
  getTrendingEntries,
  getEntry,
  createEntry,
  likeEntry,
  dislikeEntry,
  addReply
};