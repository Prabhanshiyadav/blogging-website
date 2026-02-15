import { Link } from "react-router-dom";
import API from "../api/axios";
import { motion } from "framer-motion";
import { useState } from "react";

export default function PostCard({ post, refreshPosts }) {
  const token = localStorage.getItem("token");
  const [likes, setLikes] = useState(post.likes.length);
  const [animate, setAnimate] = useState(false);

  const likePost = async () => {
    if (!token) {
      alert("Please login to like posts");
      return;
    }

    try {
      await API.put(
        `/posts/${post._id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setLikes(likes + 1);
      setAnimate(true);

      setTimeout(() => setAnimate(false), 600);

      refreshPosts && refreshPosts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="post-card">
      {post.image && (
        <img
          src={`http://localhost:5000${post.image}`}
          alt={post.title}
          style={{
            width: "100%",
            borderRadius: "10px",
            marginBottom: "10px",
          }}
        />
      )}

      <h3>{post.title}</h3>

      <p>{post.content.substring(0, 120)}...</p>

      <small>
        By {post.author?.name || "User"} |{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </small>

      <div style={{ marginTop: "10px", display: "flex", alignItems: "center" }}>
        {/* Animated Heart */}
        <motion.button
          whileTap={{ scale: 1.5 }}
          animate={animate ? { scale: [1, 1.6, 1] } : {}}
          transition={{ duration: 0.4 }}
          onClick={likePost}
          style={{
            border: "none",
            background: "none",
            cursor: "pointer",
            fontSize: "20px",
          }}
        >
          ❤️
        </motion.button>

        <span style={{ marginLeft: "6px", fontWeight: "bold" }}>
          {likes}
        </span>

        <Link to={`/post/${post._id}`} style={{ marginLeft: "15px" }}>
          Read More →
        </Link>
      </div>

      {/* Floating Hearts */}
      {animate && (
        <motion.div
          initial={{ opacity: 1, y: 0 }}
          animate={{ opacity: 0, y: -40 }}
          transition={{ duration: 0.6 }}
          style={{
            position: "absolute",
            fontSize: "24px",
          }}
        >
          ❤️
        </motion.div>
      )}
    </div>
  );
}
