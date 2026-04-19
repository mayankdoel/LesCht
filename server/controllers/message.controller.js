const Message = require("../models/Message.model");

// Temporary function, used for the "Global" fallback area we had before communities
exports.getMessages = async (req, res) => {
  try {
    const messages = await Message.find({ channelId: { $exists: false }, dmId: { $exists: false } })
      .populate("authorId", "username avatarUrl")
      .sort({ createdAt: 1 })
      .limit(100);

    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      content: msg.content,
      author: msg.authorId.username,
      timestamp: msg.createdAt
    }));

    res.json(formattedMessages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

exports.getChannelMessages = async (req, res) => {
  try {
    const { channelId } = req.params;
    const messages = await Message.find({ channelId })
      .populate("authorId", "username avatarUrl")
      .sort({ createdAt: 1 })
      .limit(100);

    const formattedMessages = messages.map(msg => ({
      id: msg._id,
      content: msg.content,
      author: msg.authorId.username,
      timestamp: msg.createdAt,
      channelId: msg.channelId
    }));

    res.json(formattedMessages);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch channel messages" });
  }
};
