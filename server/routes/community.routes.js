const express = require("express");
const router = express.Router();
const communityController = require("../controllers/community.controller");
const { verifyJWT } = require("../middleware/auth.middleware");

router.post("/", verifyJWT, communityController.createCommunity);
router.get("/", verifyJWT, communityController.getUserCommunities);
router.post("/join", verifyJWT, communityController.joinCommunity);

module.exports = router;
