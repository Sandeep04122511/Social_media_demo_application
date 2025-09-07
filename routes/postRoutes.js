// backend/routes/postRoutes.js
import express from "express";
import multer from "multer";
import { protect } from "../middleware/authMiddleware.js";
import { createPost, getPosts, deletePost } from "../controllers/postController.js";

const router = express.Router();

// Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

// Routes
router.get("/", getPosts);
router.post("/", protect, upload.single("image"), createPost);

// ✅ Delete post
router.delete("/:id", protect, deletePost);

export default router;
