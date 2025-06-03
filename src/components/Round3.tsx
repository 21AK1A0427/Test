import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Round1.css"; // Ensure that Round1.css is imported
import videoBg from "../assets/exambg.mp4";

// Navbar Component
const Navbar = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      setUserEmail(email);
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <nav className="round1-navbar">
      <div className="logo-container">
        <img src="https://i.imgur.com/oGtwSmY.png" alt="Logo" />
        <h1 className="logo">CODEATHON 2K25</h1>
      </div>
      <div className="user-info">
        {userEmail ? (
          <>
            {userEmail.split("@")[0]} ({userEmail})
            <button
              className="logout-btn"
              onClick={() => {
                localStorage.removeItem("email");
                navigate("/login");
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button
            className="logout-btn"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

const Round1: React.FC = () => {
  const navigate = useNavigate();
  const [showInstructions, setShowInstructions] = useState<boolean>(false);
  const [ ,setImageIndex] = useState<number>(0);
  const [ ,setFadeIn] = useState<boolean>(false);

  const handleNextClick = () => {
    setFadeIn(false); // Remove image temporarily
    setTimeout(() => {
      setImageIndex(1); // Change image
      setFadeIn(true); // Bring new image in smoothly
    }, 300); // Delay for smooth transition

    setTimeout(() => {
      setShowInstructions(true);
    }, 600);
  };

  return (
    <div className="round1-container">
      {/* Navbar */}
      <Navbar />
      <video className="bg-video" autoPlay loop muted>
                <source src={videoBg} type="video/mp4" />
            </video>
      {/* Main Card with Image */}
      <div className="round1-card-container">
        <div
          className={`round1-transparent-card ${showInstructions ? "expanded" : ""}`}
        >
          {!showInstructions ? (
            <>
              {/* Image on the Card */}
              <img
                className="round1-image"
                src="https://i.imgur.com/IQv8V4V.png"
                alt="Final Card Image"
              />

              {/* Next Button */}
              <button className="btn" onClick={handleNextClick}>
                Next
              </button>
            </>
          ) : (
            <>
              <img
                className="round1-image"
                src="https://i.imgur.com/haEp60y.jpeg"
                alt="Final Card Image"
              />
              <button className="btn start-btn" onClick={() => navigate("/Validation3")}>
                Start Exam
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Round1;
