const mongoose = require("mongoose");

const ThreadSchema = new mongoose.Schema({
  title:       { type: String, maxlength: 200 },
  channelId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
  originMsgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Message', unique: true },
  creatorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  archivedAt:  { type: Date, default: null },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model("Thread", ThreadSchema);
