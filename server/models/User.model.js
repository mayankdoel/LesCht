const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username:     { type: String, unique: true, required: true, minlength: 3, maxlength: 20 },
  displayName:  { type: String, maxlength: 50 },
  email:        { type: String, unique: true, required: true },
  passwordHash: { type: String },               // null for Google OAuth users
  googleId:     { type: String },               // same as 1Clik Google OAuth
  avatarUrl:    { type: String },
  bio:          { type: String, maxlength: 160 },
  status:       { type: String, enum: ['ONLINE','IDLE','DND','INVISIBLE','OFFLINE'], default: 'OFFLINE' },
  customStatus: { type: String, maxlength: 60 },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
