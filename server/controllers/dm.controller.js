const DM = require("../models/DM.model");
const Message = require("../models/Message.model");
const User = require("../models/User.model");

// List all DMs for the logged-in user
exports.getDMs = async (req, res) => {
  try {
    const dms = await DM.find({ participants: req.user._id })
      .populate("participants", "username displayName avatarUrl status");
    res.json(dms);
  } catch (err) {
    res.status(500).json({ error: "Server Error fetching DMs" });
  }
};

// Start or get an existing DM with another user
exports.getOrStartDM = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.user._id;

    if (targetUserId === currentUserId.toString()) {
      return res.status(400).json({ error: "Cannot DM yourself" });
    }

    // Check if DM already exists
    let dm = await DM.findOne({
      participants: { $all: [currentUserId, targetUserId] }
    }).populate("participants", "username displayName avatarUrl status");

    if (!dm) {
      // Create new DM
      dm = await DM.create({ participants: [currentUserId, targetUserId] });
      dm = await DM.findById(dm._id).populate("participants", "username displayName avatarUrl status");
    }

    res.json(dm);
  } catch (err) {
    res.status(500).json({ error: "Server Error starting DM" });
  }
};

// Fetch messages for a specific DM
exports.getDMMessages = async (req, res) => {
  try {
    const dmId = req.params.dmId;
    
    // Minimal check to ensure user is in this DM
    const dm = await DM.findById(dmId);
    if (!dm?.participants.includes(req.user._id)) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const messages = await Message.find({ dmId })
      .populate("authorId", "username avatarUrl")
      .sort({ createdAt: 1 })
      .limit(100);

    const formatted = messages.map(msg => ({
      id: msg._id,
      content: msg.content,
      author: msg.authorId.username,
      timestamp: msg.createdAt,
      dmId: msg.dmId
    }));

    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: "Server Error fetching DM messages" });
  }
};
