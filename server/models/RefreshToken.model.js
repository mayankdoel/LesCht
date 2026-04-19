const mongoose = require("mongoose");

const RefreshTokenSchema = new mongoose.Schema({
  token:     { type: String, unique: true, required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
