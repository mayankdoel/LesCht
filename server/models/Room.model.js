const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, maxlength: 280 },
  type:        { type: String, enum: ['PUBLIC','PRIVATE'], default: 'PUBLIC' },
  mode:        { type: String, enum: ['EPHEMERAL','PERSISTENT'], default: 'PERSISTENT' },
  inviteCode:  { type: String, unique: true },    // short random slug
  ownerId:     { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  members:     [{ userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, role: { type: String, enum: ['OWNER','ADMIN','MODERATOR','MEMBER'] } }],
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model("Room", RoomSchema);
