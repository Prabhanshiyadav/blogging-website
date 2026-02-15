import { useEffect, useState } from "react";
import API from "../api/axios";
import PostCard from "../components/PostCard";
import "./Home.css";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/posts");
      setPosts(data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <div className="hero">
        <h1>Share Your Ideas With The World</h1>
        <p>Write, inspire, and connect with others through your thoughts.</p>
      </div>

      <div className="container">
        <h2>All Posts</h2>

        {loading && <p>Loading posts...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {!loading && posts.length === 0 && <p>No posts yet...</p>}

        {!loading &&
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              refreshPosts={fetchPosts}
            />
          ))}
      </div>
    </div>
  );
}
