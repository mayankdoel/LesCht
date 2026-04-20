const User = require("../models/User.model");
const RefreshToken = require("../models/RefreshToken.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: "30d" });
  return { accessToken, refreshToken };
};

exports.register = async (req, res) => {
  try {
    const { username, email, password, displayName } = req.body;

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ error: "Username or email already exists." });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      passwordHash,
      displayName: displayName || username,
      status: "ONLINE"
    });

    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token to DB
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    });

    res.status(201).json({
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email, avatarUrl: user.avatarUrl }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during registration." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Generate new tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Replace old refresh token logic (simple overwrite for this MVP, could keep multiple for multi-device)
    await RefreshToken.findOneAndDelete({ userId: user._id });
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    // Set user online
    user.status = "ONLINE";
    await user.save();

    res.json({
      accessToken,
      refreshToken,
      user: { id: user._id, username: user.username, email: user.email, avatarUrl: user.avatarUrl }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during login." });
  }
};

exports.refresh = async (req, res) => {
  try {
    const { token } = req.body;
    if (!token) return res.status(401).json({ error: "Refresh token required." });

    const existingToken = await RefreshToken.findOne({ token });
    if (!existingToken || existingToken.expiresAt < new Date()) {
        if(existingToken) await RefreshToken.findByIdAndDelete(existingToken._id);
        return res.status(403).json({ error: "Invalid or expired refresh token." });
    }

    jwt.verify(token, process.env.JWT_REFRESH_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ error: "Invalid refresh token." });

      const newTokens = generateTokens(decoded.id);

      // Rotate refresh token
      existingToken.token = newTokens.refreshToken;
      existingToken.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      await existingToken.save();

      res.json({
        accessToken: newTokens.accessToken,
        refreshToken: newTokens.refreshToken
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error during token refresh." });
  }
};

exports.logout = async (req, res) => {
  try {
    const { token } = req.body;
    if (token) {
        await RefreshToken.findOneAndDelete({ token });
    }
    
    // Set user offline
    if (req.user) {
        req.user.status = "OFFLINE";
        await req.user.save();
    }
    
    res.json({ message: "Successfully logged out." });
  } catch (error) {
    res.status(500).json({ error: "Server error during logout." });
  }
};

exports.getMe = async (req, res) => {
  try {
    // User is already attached by verifyJWT middleware
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ error: "Server error." });
  }
};

exports.googleCallback = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=google_auth_failed`);
    }

    // Generate JWT tokens
    const { accessToken, refreshToken } = generateTokens(user._id);

    // Save refresh token to DB
    await RefreshToken.findOneAndDelete({ userId: user._id });
    await RefreshToken.create({
      token: refreshToken,
      userId: user._id,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    });

    // Set user online
    user.status = "ONLINE";
    await user.save();

    // Redirect to frontend with tokens
    const clientURL = process.env.CLIENT_URL || "http://localhost:5173";
    res.redirect(`${clientURL}/auth/google/callback?accessToken=${accessToken}&refreshToken=${refreshToken}`);
  } catch (error) {
    console.error("Google callback error:", error);
    res.redirect(`${process.env.CLIENT_URL || "http://localhost:5173"}/login?error=server_error`);
  }
};
