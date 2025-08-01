import express from "express";
import { body, validationResult } from "express-validator";
import Post from "../models/Post.js";
import auth from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });

    res.status(200).json({ total: posts.length, posts });
  } catch (err) {
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

router.post(
  "/",
  auth,
  upload.single("image"),
  body("title").notEmpty(),
  body("content").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const newPost = new Post({
        ...req.body,
        image: req.file ? req.file.path : null,
        user: req.user.id,
      });

      const savedPost = await newPost.save();
      res.status(201).json(savedPost);
    } catch (err) {
      console.error("❌ Post creation failed:", err);
      res.status(500).json({ error: "Something went wrong on the server." });
    }
  }
);

router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updatedData = req.body;
    if (req.file) {
      updatedData.image = req.file.path;
    }

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      updatedData,
      {
        new: true,
      }
    );

    res.json(updatedPost);
  } catch (err) {
    console.error("❌ Post update failed:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await post.deleteOne();
    res.status(204).end();
  } catch (err) {
    console.error("❌ Post delete failed:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
