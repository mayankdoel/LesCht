const Community = require("../models/Community.model");
const Channel = require("../models/Channel.model");
const crypto = require("crypto");

// Generator matching PRD 1Clik/MagicURL short slug logic
const generateInviteCode = () => {
    return crypto.randomBytes(4).toString('hex');
};

exports.createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Create Community
    const community = await Community.create({
      name,
      description,
      ownerId: req.user._id,
      members: [req.user._id],
      inviteCode: generateInviteCode()
    });

    // Create default 'general' channel
    const defaultChannel = await Channel.create({
      communityId: community._id,
      name: "general",
      type: "TEXT"
    });

    community.channels.push(defaultChannel._id);
    await community.save();

    res.status(201).json(community);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create community." });
  }
};

exports.getUserCommunities = async (req, res) => {
  try {
    const communities = await Community.find({ members: req.user._id })
      .populate("channels");
    res.json(communities);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch communities." });
  }
};

exports.joinCommunity = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    
    const community = await Community.findOne({ inviteCode });
    if (!community) {
      return res.status(404).json({ error: "Invalid invite code." });
    }

    if (community.members.includes(req.user._id)) {
      return res.status(400).json({ error: "Already a member." });
    }

    community.members.push(req.user._id);
    await community.save();

    res.json(community);
  } catch (error) {
    res.status(500).json({ error: "Failed to join community." });
  }
};
