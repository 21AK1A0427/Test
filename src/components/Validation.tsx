import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Round1Questions.css";

const VALIDATE_EXAM_API = "https://login-backend-97xw.onrender.com/validate";



const ExamSystem123: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rollNumber, setRollNumber] = useState(""); // Updated field
  const [errorMessage, setErrorMessage] = useState("");

  const validateExamCredentials = async () => {
    setErrorMessage("");

    if (!email || !password || !rollNumber) {
      setErrorMessage("All fields are required!");
      return;
    }

    try {
      const response = await fetch(VALIDATE_EXAM_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, rollNumber }),
      });

      const result = await response.json();
      console.log("Server Response:", result);

      if (result.success) {
        sessionStorage.setItem("rollNumber", rollNumber);
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("password", password);
        navigate("/Questions");
      } else {
        setErrorMessage(result.error || "Invalid credentials! Please check your details.");
      }
    } catch (error) {
      console.error("Error validating exam:", error);
      setErrorMessage("Network error! Please try again.");
    }
  };

  return (
    
    <div className="exam-container-123">
      <h1 className="exam-heading-123">Login to Start Exam</h1>
      {errorMessage && <p className="error-message-123">{errorMessage}</p>}
      <input
        type="email"
        className="exam-input-123"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        className="exam-input-123"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="text"
        className="exam-input-123"
        placeholder="Roll Number"
        value={rollNumber}
        onChange={(e) => setRollNumber(e.target.value)}
      />
      <button className="exam-button-123" onClick={validateExamCredentials}>
        Start Exam
      </button>
    </div>
  );
};

export default ExamSystem123;
