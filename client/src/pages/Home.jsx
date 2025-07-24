import React from "react";
import { Navigate } from "react-router-dom";

const Home = () => {
  // const user = JSON.parse(localStorage.getItem("user"));
  // Remove redirect logic
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>Welcome to ShopVerse</h1>
      <p>Hello, Guest!</p>
      <button
        style={{ marginTop: 32, padding: '12px 28px', background: '#6b46c1', color: 'white', border: 'none', borderRadius: 8, fontSize: '1rem', cursor: 'pointer' }}
        onClick={() => { localStorage.removeItem('user'); window.location.href = '/'; }}
      >
        Logout
      </button>
    </div>
  );
};

export default Home;

