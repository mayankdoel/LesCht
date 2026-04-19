const { Server } = require("socket.io");
const Redis = require("ioredis");
const { createAdapter } = require("@socket.io/redis-adapter");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const Message = require("../models/Message.model");
const DM = require("../models/DM.model");
const Community = require("../models/Community.model");

let io;

const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // try {
  //   const pubClient = new Redis(process.env.REDIS_URL || "redis://localhost:6379", { maxRetriesPerRequest: null, retryStrategy: () => null });
  //   const subClient = pubClient.duplicate();
  //   
  //   pubClient.on('error', (err) => console.warn('Redis PubClient Error:', err.message));
  //   subClient.on('error', (err) => console.warn('Redis SubClient Error:', err.message));
  //
  //   io.adapter(createAdapter(pubClient, subClient));
  // } catch (err) {
  //   console.error("Redis connection failed. Continuing without Redis adapter.", err);
  // }

  // Socket Authentication Middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error("Authentication Error"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user) return next(new Error("User not found"));
      
      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication Error"));
    }
  });

  io.on("connection", async (socket) => {
    const user = socket.user;
    console.log(`Socket connected: ${user.username}`);

    // Join user to all their DM rooms immediately
    const userDms = await DM.find({ participants: user._id });
    userDms.forEach(dm => {
      socket.join(dm._id.toString());
    });

    // Join user to all their Communities' Channels immediately
    const userCommunities = await Community.find({ members: user._id }).populate("channels");
    userCommunities.forEach(community => {
      community.channels.forEach(channel => {
        socket.join(channel._id.toString());
      });
    });

    socket.on("user:join", () => {
      io.emit("presence:update", {
        username: user.username,
        status: "ONLINE",
        socketId: socket.id
      });
    });

    // GLOBAL Chat 
    socket.on("message:send", async (data) => {
      try {
        const { content } = data;
        const savedMessage = await Message.create({ content, authorId: user._id });
        io.emit("message:receive", {
          id: savedMessage._id,
          content: savedMessage.content,
          author: user.username,
          timestamp: savedMessage.createdAt,
          isGlobal: true
        });
      } catch (error) { console.error("Error saving message:", error); }
    });

    // CHANNEL Chat
    socket.on("channel:message:send", async (data) => {
      try {
        const { content, channelId } = data;
        if (!socket.rooms.has(channelId)) return;
        
        const savedMessage = await Message.create({ content, authorId: user._id, channelId });
        io.to(channelId).emit("channel:message:receive", {
          id: savedMessage._id,
          content: savedMessage.content,
          author: user.username,
          timestamp: savedMessage.createdAt,
          channelId
        });
      } catch (error) { console.error("Error saving channel message:", error); }
    });

    // DM Chat
    socket.on("dm:message:send", async (data) => {
      try {
        const { content, dmId } = data;
        // Verify user is in DM
        if (!socket.rooms.has(dmId)) return;
        
        const savedMessage = await Message.create({ content, authorId: user._id, dmId });
        io.to(dmId).emit("dm:message:receive", {
          id: savedMessage._id,
          content: savedMessage.content,
          author: user.username,
          timestamp: savedMessage.createdAt,
          dmId
        });
      } catch (error) { console.error("Error saving DM:", error); }
    });

    // Join a newly created/joined channel (called by client after creating/joining community)
    socket.on("channel:join", ({ channelId }) => {
      socket.join(channelId);
    });

    // GLOBAL Typing
    socket.on("typing:start", () => socket.broadcast.emit("typing:update", { username: user.username, isTyping: true }));
    socket.on("typing:stop", () => socket.broadcast.emit("typing:update", { username: user.username, isTyping: false }));

    // DM Typing
    socket.on("dm:typing:start", ({ dmId }) => {
      socket.to(dmId).emit("dm:typing:update", { username: user.username, isTyping: true, dmId });
    });
    socket.on("dm:typing:stop", ({ dmId }) => {
      socket.to(dmId).emit("dm:typing:update", { username: user.username, isTyping: false, dmId });
    });

    // CHANNEL Typing
    socket.on("channel:typing:start", ({ channelId }) => {
      socket.to(channelId).emit("channel:typing:update", { username: user.username, isTyping: true, channelId });
    });
    socket.on("channel:typing:stop", ({ channelId }) => {
      socket.to(channelId).emit("channel:typing:update", { username: user.username, isTyping: false, channelId });
    });

    socket.on("disconnect", () => {
      io.emit("presence:update", {
        username: user.username,
        status: "OFFLINE",
        socketId: socket.id
      });
    });
  });

  return io;
};

const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};

module.exports = { initializeSocket, getIO };
