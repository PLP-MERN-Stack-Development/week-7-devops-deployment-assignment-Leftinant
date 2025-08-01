import express from "express";
import Comment from "../models/Comment.js";
import auth from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:postId", async (req, res) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).populate(
      "author"
    );
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch comments" });
  }
});

router.post("/:postId", auth, async (req, res) => {
  try {
    const comment = new Comment({
      postId: req.params.postId,
      author: req.user.id,
      text: req.body.text,
    });
    const saved = await comment.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: "Failed to create comment" });
  }
});

export default router;
