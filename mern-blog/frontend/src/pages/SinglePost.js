import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { jwtDecode } from "jwt-decode";


function SinglePost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");

  const getUserId = () => {
    if (!token) return null;
    const decoded = jwtDecode(token);
    return decoded.id;
  };

  const loggedInUserId = getUserId();

  // ✅ useCallback fixes warning
  const fetchPost = useCallback(async () => {
    try {
      const res = await API.get(`/api/posts/${id}`);
      setPost(res.data);
      setTitle(res.data.title);
      setContent(res.data.content);
    } catch (error) {
      console.log(error);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const deletePost = async () => {
    if (!window.confirm("Are you sure you want to delete this post?"))
      return;

    try {
      await API.delete(`/api/posts/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const updatePost = async () => {
    try {
      await API.put(
        `/api/posts/${id}`,
        { title, content },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setEditing(false);
      fetchPost();
    } catch (error) {
      console.log(error);
    }
  };

  if (!post) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;

  const isAuthor =
    loggedInUserId && post.author?._id === loggedInUserId;

  return (
    <div className="container">
      <div className="post-card">
        {editing ? (
          <>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              style={{ width: "100%", padding: "10px" }}
            />
            <button onClick={updatePost} className="btn">
              Save Changes
            </button>
          </>
        ) : (
          <>
            <h2>{post.title}</h2>
            <p style={{ color: "gray", fontSize: "14px" }}>
              By {post.author?.username}
            </p>
            <p style={{ marginTop: "15px" }}>{post.content}</p>
          </>
        )}

        <div style={{ marginTop: "20px" }}>
          ❤️ {post.likes.length} Likes
        </div>

        {isAuthor && !editing && (
          <div style={{ marginTop: "20px" }}>
            <button
              onClick={() => setEditing(true)}
              className="btn"
              style={{ marginRight: "10px" }}
            >
              Edit
            </button>

            <button
              onClick={deletePost}
              className="btn"
              style={{ background: "#ef4444" }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default SinglePost;
