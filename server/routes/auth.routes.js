const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const { verifyJWT } = require("../middleware/auth.middleware");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh", authController.refresh);

// Protected routes (require JWT)
router.post("/logout", verifyJWT, authController.logout);
router.get("/me", verifyJWT, authController.getMe);

module.exports = router;
