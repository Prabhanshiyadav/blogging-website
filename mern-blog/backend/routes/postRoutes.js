const express = require("express");
const router = express.Router();

const Post = require("../models/Post"); // ✅ IMPORTANT
const authMiddleware = require("../middleware/authMiddleware");

const {
  createPost,
  getPosts,
  getPostById,
  toggleLikePost,
} = require("../controllers/postController");

const upload = require("../middleware/uploadMiddleware");


// GET ALL POSTS
router.get("/", getPosts);

// GET SINGLE POST
router.get("/:id", getPostById);

// CREATE POST WITH IMAGE
router.post("/", authMiddleware, upload.single("image"), createPost);


// ADD COMMENT
router.post("/:id/comment", authMiddleware, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const newComment = {
      user: req.user._id,
      text: req.body.text,
    };

    post.comments.push(newComment);
    await post.save();

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: "Error adding comment" });
  }
});


// LIKE POST
router.put("/:id/like", authMiddleware, toggleLikePost);

module.exports = router;
