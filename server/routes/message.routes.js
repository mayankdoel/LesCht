const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { verifyJWT } = require("../middleware/auth.middleware");

router.get("/", verifyJWT, messageController.getMessages);
router.get("/channel/:channelId", verifyJWT, messageController.getChannelMessages);

module.exports = router;
