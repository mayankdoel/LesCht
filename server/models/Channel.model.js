const mongoose = require("mongoose");

// Lives inside a Community, grouped by topicName string
const ChannelSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  communityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Community', required: true },
  topicName:   { type: String, default: 'General' },
  isReadonly:  { type: Boolean, default: false },
  slowModeSec: { type: Number, default: 0 },
  position:    { type: Number, default: 0 },
  createdAt:   { type: Date, default: Date.now }
});

module.exports = mongoose.model("Channel", ChannelSchema);
