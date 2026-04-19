const express = require("express");
const router = express.Router();
const dmController = require("../controllers/dm.controller");
const { verifyJWT } = require("../middleware/auth.middleware");

router.get("/", verifyJWT, dmController.getDMs);
router.post("/:userId", verifyJWT, dmController.getOrStartDM);
router.get("/:dmId/messages", verifyJWT, dmController.getDMMessages);

module.exports = router;
