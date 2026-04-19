require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { initializeSocket } = require("./socket");

// Initialize internal systems
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initializeSocket(server);

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true
}));
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/messages", require("./routes/message.routes"));
app.use("/api/dms", require("./routes/dm.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/communities", require("./routes/community.routes"));

// Basic healthcheck route
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Lescht API is running smoothly." });
});

// Default catch-all
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// Error boundary
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server listening on port ${PORT}`);
});

// touch
// touch 2