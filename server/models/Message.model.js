const mongoose = require("mongoose");

// Exactly ONE of dmId / roomId / channelId / threadId will be set per message
const MessageSchema = new mongoose.Schema({
  content:    { type: String, required: true },
  authorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  dmId:       { type: mongoose.Schema.Types.ObjectId, ref: 'DM',      default: null },
  roomId:     { type: mongoose.Schema.Types.ObjectId, ref: 'Room',     default: null },
  channelId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Channel',  default: null },
  threadId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Thread',   default: null },
  replyToId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Message',  default: null },
  reactions:  [{ emoji: String, users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] }],
  editedAt:   { type: Date, default: null },
  deletedAt:  { type: Date, default: null },
  createdAt:  { type: Date, default: Date.now }
});

MessageSchema.index({ roomId: 1, createdAt: -1 });
MessageSchema.index({ channelId: 1, createdAt: -1 });
MessageSchema.index({ content: 'text' }); // MongoDB text index for search

module.exports = mongoose.model("Message", MessageSchema);
