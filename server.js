// server.js
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import http from "http";
import { Server as SocketIO } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Models
import User from "./models/User.js";

// Load environment variables
dotenv.config();

// Initialize app & server
const app = express();
const server = http.createServer(app);

// ----- Middleware -----
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// ----- Static Files -----
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ----- API Routes -----
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// ----- Socket.IO -----
const io = new SocketIO(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] }
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log(`🟢 Socket connected: ${socket.id}`);
  socket.on("disconnect", () => console.log(`🔴 Socket disconnected: ${socket.id}`));
});

// ----- MongoDB Connection -----
const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log("✅ MongoDB connected");

    // Optional: cleanup old username index if exists
    try {
      const indexes = await User.collection.getIndexes({ full: true });
      const usernameIndex = indexes.find(idx => idx.name === "username_1");
      if (usernameIndex) {
        await User.collection.dropIndex("username_1");
        console.log("🗑️ Dropped old username index");
      }
    } catch (err) {
      console.warn("⚠️ Index cleanup skipped:", err.message);
    }

    // Start server
    server.listen(PORT, () =>
      console.log(`🚀 Server running on http://localhost:${PORT}`)
    );

  } catch (err) {
    console.error("❌ Failed to connect to MongoDB:", err.message);
    process.exit(1);
  }
};

connectDB();
