const express = require("express");
const router = express.Router();
const passport = require("passport");
const authController = require("../controllers/auth.controller");
const { verifyJWT } = require("../middleware/auth.middleware");

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
const isGoogleAuthConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
);

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);
router.get("/providers", (req, res) => {
  res.json({
    google: {
      enabled: isGoogleAuthConfigured,
    },
  });
});

// Protected routes (require JWT)
router.post("/logout", verifyJWT, authController.logout);
router.get("/me", verifyJWT, authController.getMe);

// Google OAuth routes
router.get(
  "/google",
  (req, res, next) => {
    if (!isGoogleAuthConfigured) {
      return res.redirect(`${clientUrl}/login?error=google_auth_unavailable`);
    }

    return passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    })(req, res, next);
  }
);

router.get(
  "/google/callback",
  (req, res, next) => {
    if (!isGoogleAuthConfigured) {
      return res.redirect(`${clientUrl}/login?error=google_auth_unavailable`);
    }

    return passport.authenticate("google", {
      session: false,
      failureRedirect: `${clientUrl}/login?error=google_auth_failed`,
    })(req, res, next);
  },
  authController.googleCallback
);

module.exports = router;
