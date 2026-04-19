const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Unauthorized. Token missing." });
    }

    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) return res.status(403).json({ error: "Forbidden. Invalid token." });
      
      const user = await User.findById(decoded.id).select("-passwordHash");
      if (!user) return res.status(401).json({ error: "Unauthorized. User no longer exists." });

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(500).json({ error: "Server Error in authorization." });
  }
};

module.exports = { verifyJWT };
