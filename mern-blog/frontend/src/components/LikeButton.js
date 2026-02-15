import React, { useState } from "react";

const LikeButton = ({ initialLikes = 0 }) => {
  const [likes, setLikes] = useState(initialLikes);
  const [animate, setAnimate] = useState(false);

  const handleLike = () => {
    setLikes(likes + 1);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 500);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={handleLike}
        style={{
          fontSize: "22px",
          border: "none",
          background: "white",
          cursor: "pointer"
        }}
      >
        ❤️ {likes}
      </button>

      {animate && (
        <span
          style={{
            position: "absolute",
            left: "50%",
            top: "0",
            transform: "translateX(-50%)",
            animation: "float 0.5s ease-out"
          }}
        >
          ❤️
        </span>
      )}

      <style>
        {`
          @keyframes float {
            0% { transform: translate(-50%, 0); opacity: 1; }
            100% { transform: translate(-50%, -40px); opacity: 0; }
          }
        `}
      </style>
    </div>
  );
};

export default LikeButton;
