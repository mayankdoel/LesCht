require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User.model');
const Community = require('./models/Community.model');
const Channel = require('./models/Channel.model');
const Message = require('./models/Message.model');

const MONGO_URI = process.env.MONGODB_URI;

async function seedDatabase() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected successfully.");

    // Clear existing
    console.log("Emptying database...");
    await Promise.all([
      User.deleteMany({}),
      Community.deleteMany({}),
      Channel.deleteMany({}),
      Message.deleteMany({})
    ]);

    // Create 3 Users
    const passwordHash = await bcrypt.hash('password123', 10);
    const users = await User.insertMany([
      { username: 'abhishek', email: 'abhishek@test.com', passwordHash, status: 'ONLINE', displayName: 'Abhishek Anand' },
      { username: 'zara', email: 'zara@test.com', passwordHash, status: 'ONLINE', displayName: 'Zara G.' },
      { username: 'kai_gamer', email: 'kai@test.com', passwordHash, status: 'IDLE', displayName: 'Kai' }
    ]);
    console.log("Created users: abhishek, zara, kai_gamer (password for all is 'password123')");

    // Create a Community (Lescht HQ)
    const community = await Community.create({
      name: "Lescht HQ",
      description: "The official home for Lescht developers and early adopters.",
      inviteCode: Math.random().toString(36).substring(2, 8),
      ownerId: users[0]._id,
      members: [
        { userId: users[0]._id, role: 'OWNER' },
        { userId: users[1]._id, role: 'MEMBER' },
        { userId: users[2]._id, role: 'MEMBER' }
      ]
    });
    console.log(`Created Community: 'Lescht HQ' (Invite: ${community.inviteCode})`);

    // Create multiple Channels
    const channels = await Channel.insertMany([
      { name: "general", communityId: community._id, topicName: "Lobby" },
      { name: "announcements", communityId: community._id, topicName: "Lobby", isReadonly: true },
      { name: "off-topic", communityId: community._id, topicName: "Lobby" }
    ]);
    console.log("Created channels for Community.");

    // Create some messages in the global empty channel
    await Message.insertMany([
      { content: "Welcome to the global Lescht chat! Anyone online here?", authorId: users[0]._id },
      { content: "Hey! The new light theme looks pretty awesome.", authorId: users[1]._id }
    ]);

    // Create some messages in the '#general' community channel
    await Message.insertMany([
      { content: "Welcome to the Lescht HQ server everybody!", authorId: users[0]._id, channelId: channels[0]._id },
      { content: "Glad to be here! When are we playing some games?", authorId: users[2]._id, channelId: channels[0]._id },
      { content: "Let's organize a lobby tonight around 8 PM.", authorId: users[1]._id, channelId: channels[0]._id }
    ]);
    console.log("Created messages.");

    console.log("✅ Seeding completed! Exiting...");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
}

seedDatabase();
