import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css"; // Importing CSS file
import videoBg from "../assets/videoplayback.mp4";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await fetch("https://exam-backend-1-dxch.onrender.com/login", {  // ✅ Fixed URL
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem("email", email);
        navigate("/home");
      } else {
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      setMessage("Server error. Please try again later.");
    }
  };

  return (
    <div className="login-page">
      {/* Background Video */}
      <video className="bg-video" autoPlay loop muted>
        <source src={videoBg} type="video/mp4" />
      </video>

      <div className="border-container">
        <h1 className="border-text">CODEATHON 2K25</h1>
        <h1 className="border-text2">AITT - ECE</h1>
        <h1 className="border-text3">ECE</h1>
      </div>

      <div className="login-container">
        {/* Left Side - Image */}
        <div className="image-container">
          <img src="https://i.imgur.com/hUn3BZb.png" alt="Codeathon Event" />
        </div>

        {/* Right Side - Login Card */}
        <div className="login-card">
          <h2>Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
          {message && <p className="error-message">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
