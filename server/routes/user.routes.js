const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const { verifyJWT } = require("../middleware/auth.middleware");

// Get all users for the sidebar list
router.get("/", verifyJWT, async (req, res) => {
  try {
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select("username displayName avatarUrl status customStatus");
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server Error fetching users" });
  }
});

module.exports = router;
