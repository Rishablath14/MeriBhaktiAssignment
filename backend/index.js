const express = require("express");
const mongoose = require("mongoose");
const http = require("http");
const { Server } = require("socket.io");
const dataRoutes = require("./routes/dataRoutes");
const cors = require("cors");
const errorHandler = require('./middleware/errorHandler');
const allowedOrigins = ["http://localhost:3000"];
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
require("dotenv").config();
require("./cron/cronJob"); // Load cron job

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use("/api/", limiter);
app.use("/api/data", dataRoutes);
app.use(errorHandler);  // middleware/errorHandler.js

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log("New WebSocket client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, { dbName: "posts" })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.log("Error Connecting...", error);
  });

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
