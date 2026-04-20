const mongoose = require("mongoose");

const CommunitySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String },
  avatarUrl:   { type: String },
  type:        { type: String, enum: ['PUBLIC','PRIVATE'], default: 'PUBLIC' },
  inviteCode:  { type: String, unique: true },
  ownerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members:     [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, role: String }],
  channels:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'Channel' }],
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model("Community", CommunitySchema);
