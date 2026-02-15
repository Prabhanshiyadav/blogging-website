import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/posts/${id}`)
      .then(res => setPost(res.data));
  }, [id]);

  if (!post) return <h2>Loading...</h2>;

  return (
    <div className="container mt-4">
      <h2>{post.title}</h2>

      {post.image && (
        <img
          src={`http://localhost:5000${post.image}`}
          alt=""
          style={{ width: "100%", borderRadius: "10px" }}
        />
      )}

      <p className="mt-3">{post.content}</p>
    </div>
  );
}
